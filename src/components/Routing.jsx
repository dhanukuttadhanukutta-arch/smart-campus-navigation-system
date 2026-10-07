import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

const MAIN_POINT_NAME = "P1";

// Distance between two coordinates
function getDistance(point1, point2) {
  const R = 6371;

  const lat1 = (point1[0] * Math.PI) / 180;
  const lat2 = (point2[0] * Math.PI) / 180;

  const dLat =
    ((point2[0] - point1[0]) * Math.PI) / 180;

  const dLon =
    ((point2[1] - point1[1]) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(dLon / 2) ** 2;

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return R * c;
}

// Find nearest route point to destination
function findNearestPoint(points, destination) {
  let nearest = null;
  let shortestDistance = Infinity;

  points.forEach((point) => {
    const distance = getDistance(
      point.position,
      destination
    );

    if (distance < shortestDistance) {
      shortestDistance = distance;
      nearest = point;
    }
  });

  return nearest;
}

// Dijkstra shortest path
function findShortestPath(
  points,
  connections,
  startName,
  endName
) {
  const distances = {};
  const previous = {};
  const visited = new Set();

  points.forEach((point) => {
    distances[point.name] = Infinity;
    previous[point.name] = null;
  });

  distances[startName] = 0;

  while (visited.size < points.length) {
    let current = null;
    let smallestDistance = Infinity;

    points.forEach((point) => {
      if (
        !visited.has(point.name) &&
        distances[point.name] <
          smallestDistance
      ) {
        smallestDistance =
          distances[point.name];

        current = point.name;
      }
    });

    if (current === null) {
      break;
    }

    if (current === endName) {
      break;
    }

    visited.add(current);

    connections.forEach((connection) => {
      // Ignore blocked roads
      if (connection.blocked === true) {
        return;
      }

      let neighbour = null;

      if (connection.from === current) {
        neighbour = connection.to;
      } else if (connection.to === current) {
        neighbour = connection.from;
      }

      if (!neighbour) {
        return;
      }

      const currentPoint = points.find(
        (point) =>
          point.name === current
      );

      const neighbourPoint = points.find(
        (point) =>
          point.name === neighbour
      );

      if (
        !currentPoint ||
        !neighbourPoint
      ) {
        return;
      }

      const roadDistance = getDistance(
        currentPoint.position,
        neighbourPoint.position
      );

      const newDistance =
        distances[current] +
        roadDistance;

      if (
        newDistance <
        distances[neighbour]
      ) {
        distances[neighbour] =
          newDistance;

        previous[neighbour] = current;
      }
    });
  }

  if (distances[endName] === Infinity) {
    return null;
  }

  const path = [];
  let current = endName;

  while (current !== null) {
    path.unshift(current);

    if (current === startName) {
      break;
    }

    current = previous[current];
  }

  if (path[0] !== startName) {
    return null;
  }

  return path;
}

function Routing({ from, to, destinationName }) {
  const map = useMap();

  useEffect(() => {
    if (!to) {
      return;
    }

    let routeLine = null;
    let startMarker = null;
    let destinationMarker = null;
    let routeInfo = null;

    // Get saved route points
    const savedPoints =
      localStorage.getItem(
        "campusRoutePoints"
      );

    // Get saved route connections
    const savedConnections =
      localStorage.getItem(
        "campusRouteConnections"
      );

    if (
      !savedPoints ||
      !savedConnections
    ) {
      console.log(
        "❌ Route network not found"
      );

      return;
    }

    let points;
    let connections;

    try {
      points = JSON.parse(savedPoints);
      connections =
        JSON.parse(savedConnections);
    } catch (error) {
      console.error(
        "Route data error:",
        error
      );

      return;
    }

    if (
      !points.length ||
      !connections.length
    ) {
      return;
    }

    // P1 = Main Entrance
    const startPoint = points.find(
      (point) =>
        point.name === MAIN_POINT_NAME
    );

    if (!startPoint) {
      console.log(
        "❌ P1 Main Entrance not found"
      );

      return;
    }

    // Find route point nearest to selected location
    const nearestPoint =
      findNearestPoint(
        points,
        to
      );

    if (!nearestPoint) {
      return;
    }

    // Find shortest available route
    const pathNames =
      findShortestPath(
        points,
        connections,
        MAIN_POINT_NAME,
        nearestPoint.name
      );

    if (!pathNames) {
      console.log(
        "❌ No available route"
      );

      routeInfo = L.control({
        position: "topright",
      });

      routeInfo.onAdd = function () {
        const div = L.DomUtil.create(
          "div",
          "route-info-box"
        );

        div.style.background =
          "rgba(255,255,255,0.96)";

        div.style.padding =
          "10px 12px";

        div.style.borderRadius =
          "8px";

        div.style.boxShadow =
          "0 2px 8px rgba(0,0,0,0.3)";

        div.style.fontSize = "13px";

        div.innerHTML = `
          <b style="color:#d32f2f;">
            🚧 No Available Route
          </b>
          <br/>
          All connected roads are blocked.
        `;

        return div;
      };

      routeInfo.addTo(map);

      return () => {
        if (routeInfo) {
          map.removeControl(routeInfo);
        }
      };
    }

    // Convert route names into coordinates
    const routeCoordinates =
      pathNames
        .map((name) =>
          points.find(
            (point) =>
              point.name === name
          )
        )
        .filter(Boolean)
        .map(
          (point) =>
            point.position
        );

    // Add exact destination
    routeCoordinates.push(to);

    // Calculate total distance
    let totalDistance = 0;

    for (
      let i = 0;
      i <
      routeCoordinates.length - 1;
      i++
    ) {
      totalDistance += getDistance(
        routeCoordinates[i],
        routeCoordinates[i + 1]
      );
    }

    // Walking time
    const walkingMinutes =
      Math.max(
        1,
        Math.ceil(
          (totalDistance / 5) * 60
        )
      );

    // Draw route
    routeLine = L.polyline(
      routeCoordinates,
      {
        color: "#1565c0",
        weight: 6,
        opacity: 0.95,
        lineCap: "round",
        lineJoin: "round",
      }
    ).addTo(map);

    // Main Entrance marker
    startMarker =
      L.circleMarker(
        startPoint.position,
        {
          radius: 7,
          color: "white",
          weight: 2,
          fillColor: "#1565c0",
          fillOpacity: 1,
        }
      ).addTo(map);

    startMarker.bindPopup(
      "<b>🚪 Main Entrance</b>"
    );

    // Destination marker
    destinationMarker =
      L.circleMarker(
        to,
        {
          radius: 7,
          color: "white",
          weight: 2,
          fillColor: "#e53935",
          fillOpacity: 1,
        }
      ).addTo(map);

    destinationMarker.bindPopup(
      "<b>📍 Destination</b>"
    );

    // Route information
    routeInfo = L.control({
      position: "topright",
    });

    routeInfo.onAdd = function () {
      const div = L.DomUtil.create(
        "div",
        "route-info-box"
      );

      div.style.background =
        "rgba(255,255,255,0.96)";

      div.style.padding =
        "10px 12px";

      div.style.borderRadius =
        "8px";

      div.style.boxShadow =
        "0 2px 8px rgba(0,0,0,0.3)";

      div.style.fontSize = "13px";

      div.style.lineHeight = "1.6";

      div.style.minWidth = "200px";

      div.innerHTML = `
        <div style="
          font-weight:bold;
          color:#1565c0;
          margin-bottom:4px;
        ">
          🧭 Shortest Route
        </div>

        <div>
          🚪 Start:
          <b>Main Entrance</b>
        </div>

        <div>
          📍 Destination:
<b>${destinationName || nearestPoint.name}</b>
        </div>

        <div>
          📏 Distance:
          <b>${totalDistance.toFixed(
            2
          )} km</b>
        </div>

        <div>
          🚶 Walking Time:
          <b>${walkingMinutes} min</b>
        </div>

        <div>
          🛣️ Route:
          <b>${pathNames.join(
            " → "
          )}</b>
        </div>

        <div style="
          color:#2e7d32;
          margin-top:4px;
          font-weight:bold;
        ">
          ✓ Best available route
        </div>
      `;

      return div;
    };

    routeInfo.addTo(map);

    console.log(
      "🚪 START:",
      MAIN_POINT_NAME
    );

    console.log(
      "📍 DESTINATION:",
      nearestPoint.name
    );

    console.log(
      "🛣️ SHORTEST PATH:",
      pathNames.join(" → ")
    );

    console.log(
      "📏 DISTANCE:",
      totalDistance.toFixed(2),
      "km"
    );

    return () => {
      if (
        routeLine &&
        map.hasLayer(routeLine)
      ) {
        map.removeLayer(routeLine);
      }

      if (
        startMarker &&
        map.hasLayer(startMarker)
      ) {
        map.removeLayer(startMarker);
      }

      if (
        destinationMarker &&
        map.hasLayer(
          destinationMarker
        )
      ) {
        map.removeLayer(
          destinationMarker
        );
      }

      if (routeInfo) {
        map.removeControl(
          routeInfo
        );
      }
    };
  }, [to, map]);

  return null;
}

export default Routing;