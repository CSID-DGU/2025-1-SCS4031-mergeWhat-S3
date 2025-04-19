const htmlContent = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>카카오맵 예제</title>
    <style>
      body, html { margin: 0; padding: 0; height: 100%; }
      #map { width: 100%; height: 100%; }
    </style>
    <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=7fe9c6b0107267e90bf2f78c90050d42&libraries=services,drawing"></script>
  </head>
  <body>
    <div id="map"></div>
    <script>
      var mapContainer = document.getElementById("map"),
          mapOption = {
              center: new kakao.maps.LatLng(37.5665, 126.9780),
              level: 3
          };
      var map = new kakao.maps.Map(mapContainer, mapOption);
      
      // 1. 마커 생성 함수
      function createLabeledMarker(position, text) {
        const marker = new kakao.maps.Marker({
          map: map,
          position: position,
        });

        const infowindow = new kakao.maps.InfoWindow({
        content: '<div style="padding:5px;font-size:14px;">' + text + '</div>',
        });


        infowindow.open(map, marker);
      }

      // 시작 위치를 '현재위치'로 하기 위해
      // HTML5의 geolocation으로 사용할 수 있는지 확인합니다
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
          var lat = position.coords.latitude; // 위도
          var lon = position.coords.longitude; // 경도

          var locPosition = new kakao.maps.LatLng(lat, lon),
            message = '<div style="padding:5px;">현재 위치</div>';

          // 마커와 인포윈도우를 표시합니다
          displayMarker(locPosition, message);
        });
      } else {
        // geolocation을 사용할 수 없을 때
        var locPosition = new kakao.maps.LatLng(33.450701, 126.570667),
          message = "geolocation을 사용할 수 없어요..";

        displayMarker(locPosition, message);
      }

      // 지도에 마커와 인포윈도우를 표시하고 중심좌표 이동하는 함수
      function displayMarker(locPosition, message) {
        var marker = new kakao.maps.Marker({
          map: map,
          position: locPosition,
        });

        var infowindow = new kakao.maps.InfoWindow({
          content: message,
          removable: true,
        });

        infowindow.open(map, marker);

        // 지도 중심좌표를 사용자 위치로 이동
        map.setCenter(locPosition);
      }

      // 다각형을 구성하는 좌표 배열입니다. 이 좌표들을 이어서 다각형을 표시합니다
      var polygonPath = [
        new kakao.maps.LatLng(37.5703039665843, 126.99851713456405),
        new kakao.maps.LatLng(37.570002134028165, 126.99859071754375),
        new kakao.maps.LatLng(37.570006641659596, 126.9988340875362),
        new kakao.maps.LatLng(37.56989852253898, 126.9988680477879),
        new kakao.maps.LatLng(37.570051692134015, 127.0010923361216),
        new kakao.maps.LatLng(37.570574273145965, 127.0005659812195),
        new kakao.maps.LatLng(37.57054724464213, 127.0000113196203),
        new kakao.maps.LatLng(37.570421101373555, 126.99903783389733),
        new kakao.maps.LatLng(37.570362526354046, 126.99816622604045),
      ];

      // 지도에 표시할 다각형을 생성합니다
      var polygon = new kakao.maps.Polygon({
        path: polygonPath, // 그려질 다각형의 좌표 배열입니다
        strokeWeight: 3, // 선의 두께입니다
        strokeColor: "#39DE2A", // 선의 색깔입니다
        strokeOpacity: 0.8, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
        strokeStyle: "solid", // 선의 스타일입니다
        fillColor: "#A2FF99", // 채우기 색깔입니다
        fillOpacity: 0.7, // 채우기 불투명도 입니다
      });

      // 지도에 다각형을 표시합니다
      polygon.setMap(map);

      // 다각형에 마우스오버 이벤트가 발생했을 때 변경할 채우기 옵션입니다
      var mouseoverOption = {
        fillColor: "#EFFFED", // 채우기 색깔입니다
        fillOpacity: 0.8, // 채우기 불투명도 입니다
      };

      // 다각형에 마우스아웃 이벤트가 발생했을 때 변경할 채우기 옵션입니다
      var mouseoutOption = {
        fillColor: "#A2FF99", // 채우기 색깔입니다
        fillOpacity: 0.7, // 채우기 불투명도 입니다
      };

      // 다각형에 마우스오버 이벤트를 등록합니다
      kakao.maps.event.addListener(polygon, "mouseover", function () {
        // 다각형의 채우기 옵션을 변경합니다
        polygon.setOptions(mouseoverOption);
      });

      kakao.maps.event.addListener(polygon, "mouseout", function () {
        // 다각형의 채우기 옵션을 변경합니다
        polygon.setOptions(mouseoutOption);
      });

      // 다각형에 마우스다운 이벤트를 등록합니다
      var downCount = 0;
      kakao.maps.event.addListener(polygon, "mousedown", function () {
        console.log(event);
        var resultDiv = document.getElementById("result");
        resultDiv.innerHTML = "시장 구역 클릭!";
      });

      // 방산시장
      var polygonPath2 = [
        new kakao.maps.LatLng(37.56888716043808, 127.00012451305975),
        new kakao.maps.LatLng(37.56843215763552, 127.00013583160256),
        new kakao.maps.LatLng(37.568438905975164, 127.00147433898569),
        new kakao.maps.LatLng(37.56894796857013, 127.00146868933047),
      ];

      var polygon2 = new kakao.maps.Polygon({
        path: polygonPath2,
        strokeWeight: 3,
        strokeColor: "#39DE2A",
        strokeOpacity: 0.8,
        strokeStyle: "solid",
        fillColor: "#A2FF99",
        fillOpacity: 0.7,
      });

      polygon2.setMap(map);

      var mouseoverOption = {
        fillColor: "#EFFFED",
        fillOpacity: 0.8,
      };

      var mouseoutOption = {
        fillColor: "#A2FF99",
        fillOpacity: 0.7,
      };

      kakao.maps.event.addListener(polygon2, "mouseover", function () {
        polygon2.setOptions(mouseoverOption);
      });

      kakao.maps.event.addListener(polygon2, "mouseout", function () {
        polygon2.setOptions(mouseoutOption);
      });

      var downCount = 0;
      kakao.maps.event.addListener(polygon2, "mousedown", function () {
        console.log(event);
        var resultDiv = document.getElementById("result");
      });

      // 인현시장
      var polygonPath3 = [
        new kakao.maps.LatLng(37.56203725598642, 126.99561131651782),
        new kakao.maps.LatLng(37.56232781552625, 126.9953028737118),
        new kakao.maps.LatLng(37.56312745140305, 126.99533960862543),
        new kakao.maps.LatLng(37.56313195094591, 126.99520378636622),
        new kakao.maps.LatLng(37.56341576688415, 126.99525470160654),
        new kakao.maps.LatLng(37.56368606840278, 126.99531976630867),
        new kakao.maps.LatLng(37.56367931883049, 126.99552350118994),
        new kakao.maps.LatLng(37.564174865959885, 126.99550083422612),
        new kakao.maps.LatLng(37.564210892267745, 126.99515844254975),
        new kakao.maps.LatLng(37.56397888396738, 126.99511601271554),
        new kakao.maps.LatLng(37.56398788787268, 126.99497169962407),
        new kakao.maps.LatLng(37.563679292851276, 126.99488400136211),
        new kakao.maps.LatLng(37.563368451287246, 126.99493495602151),
        new kakao.maps.LatLng(37.563147706184466, 126.99491233396503),
        new kakao.maps.LatLng(37.562877404293204, 126.99484444158801),
        new kakao.maps.LatLng(37.56262511760304, 126.99467185304421),
        new kakao.maps.LatLng(37.56244716847353, 126.99462093294117),
      ];

      var polygon3 = new kakao.maps.Polygon({
        path: polygonPath3,
        strokeWeight: 3,
        strokeColor: "#39DE2A",
        strokeOpacity: 0.8,
        strokeStyle: "solid",
        fillColor: "#A2FF99",
        fillOpacity: 0.7,
      });

      polygon3.setMap(map);

      var mouseoverOption = {
        fillColor: "#EFFFED",
        fillOpacity: 0.8,
      };

      var mouseoutOption = {
        fillColor: "#A2FF99",
        fillOpacity: 0.7,
      };

      kakao.maps.event.addListener(polygon3, "mouseover", function () {
        polygon3.setOptions(mouseoverOption);
      });

      kakao.maps.event.addListener(polygon3, "mouseout", function () {
        polygon3.setOptions(mouseoutOption);
      });

      var downCount = 0;
      kakao.maps.event.addListener(polygon3, "mousedown", function () {
        console.log(event);
        var resultDiv = document.getElementById("result");
      });

      //

      //

      //

      // ✅ 지도 클릭 시 마커 찍고 좌표 출력 기능 추가
      let userClickMarker = null;

      kakao.maps.event.addListener(map, "click", function (mouseEvent) {
        const latlng = mouseEvent.latLng;

        // 이전 마커가 있으면 제거
        if (userClickMarker) {
          userClickMarker.setMap(null);
        }

        // 새 마커 생성
        userClickMarker = new kakao.maps.Marker({
          position: latlng,
          map: map,
        });

        // 콘솔에 좌표 출력
        console.log(
    'new kakao.maps.LatLng(' + latlng.getLat() + ', ' + latlng.getLng() + '),'
      );
      });
      


    </script>
  </body>
</html>
`;

export default htmlContent;
