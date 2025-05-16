const htmlContent = `
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <title>Kakao Map Indoor</title>
    <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=7fe9c6b0107267e90bf2f78c90050d42&libraries=services,drawing"></script>
    <style>
      html,
      body {
        margin: 0;
        padding: 0;
        height: 100%;
      }
      #map {
        width: 100%;
        height: 100%;
      }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script>
      const map = new kakao.maps.Map(document.getElementById("map"), {
        center: new kakao.maps.LatLng(37.570344507734944, 127.00174887659568),
        level: 3,
      });

      // 📌 시장 검색결과 -> 버튼시트에 있는 시장명 클릭하면 시장 중심위치로 화면 이동
      document.addEventListener("message", function (event) {
        const message = JSON.parse(event.data);
        if (message.type === "moveCenter" && message.lat && message.lng) {
          const newCenter = new kakao.maps.LatLng(message.lat, message.lng);
          map.setCenter(newCenter);
        }
        if (message.zoomLevel !== undefined) {
          map.setLevel(message.zoomLevel);
        }
      });

      // 📌 메인 폴리곤, 실내 폴리곤 위치좌표

      const mainPolygons = [
        {
          name: "광장시장", // 📌 광장시장
          path: [
            new kakao.maps.LatLng(37.570668867836574, 126.99837563184579),
            new kakao.maps.LatLng(37.57035802039376, 126.9981039683968),
            new kakao.maps.LatLng(37.56975885724193, 126.99803040682878),
            new kakao.maps.LatLng(37.56915519127822, 126.9980926794776),
            new kakao.maps.LatLng(37.56959669428107, 127.00022072979066),
            new kakao.maps.LatLng(37.569763370637986, 127.0013753194526),
            new kakao.maps.LatLng(37.569830943923755, 127.00148851581403),
            new kakao.maps.LatLng(37.56988049459539, 127.00178282430431),
            new kakao.maps.LatLng(37.570344507734944, 127.00174887659568),
            new kakao.maps.LatLng(37.570858075895885, 127.0016922902675),
            new kakao.maps.LatLng(37.5707995224628, 127.00045278633918),
            new kakao.maps.LatLng(37.5706598570911, 126.99831903385477),
          ],
          indoor: [
            {
              name: "a",
              path: [
                new kakao.maps.LatLng(37.569405217076785, 126.99806437448336),
                new kakao.maps.LatLng(37.569247543091684, 126.99807852784318),
                new kakao.maps.LatLng(37.5691957374624, 126.99818040391585),
                new kakao.maps.LatLng(37.56922727472191, 126.99834453474644),
                new kakao.maps.LatLng(37.569432250189685, 126.99827378363759),
              ],
            },

            {
              name: "광장순복음교회",
              path: [
                // 광장순복음교회
                new kakao.maps.LatLng(37.569405217076785, 126.99806437448336),
                new kakao.maps.LatLng(37.569247543091684, 126.99807852784318),
                new kakao.maps.LatLng(37.5691957374624, 126.99818040391585),
                new kakao.maps.LatLng(37.56922727472191, 126.99834453474644),
                new kakao.maps.LatLng(37.569432250189685, 126.99827378363759),
              ],
            },
            {
              name: "아피아상가, 구제천국",
              path: [
                // 아피아상가, 구제천국
                new kakao.maps.LatLng(37.56972506953239, 126.99800776872678),
                new kakao.maps.LatLng(37.569425489196114, 126.99804739478296),
                new kakao.maps.LatLng(37.569461532872396, 126.99829642187375),
                new kakao.maps.LatLng(37.569752102701486, 126.99821434888102),
              ],
            },
            {
              name: "파인플러스, 바다극장",
              path: [
                // 파인플러스, 바다극장
                new kakao.maps.LatLng(37.569463786124764, 126.99835018924),
                new kakao.maps.LatLng(37.56923628572396, 126.99842094064482),
                new kakao.maps.LatLng(37.569290349568746, 126.998766182121),
                new kakao.maps.LatLng(37.56944577114643, 126.99875203024024),
                new kakao.maps.LatLng(37.56944576857154, 126.99852847103165),
                new kakao.maps.LatLng(37.56946604028789, 126.99847470321365),
              ],
            },
            {
              name: "동양빌딩, 영신상가",
              path: [
                // 동양빌딩, 영신상가
                new kakao.maps.LatLng(37.569477303519584, 126.99853696000501),
                new kakao.maps.LatLng(37.56948406348508, 126.9987548594662),
                new kakao.maps.LatLng(37.569727332383245, 126.99876617491275),
                new kakao.maps.LatLng(37.56982193681678, 126.99875768371926),
                new kakao.maps.LatLng(37.56978364180492, 126.99852280463209),
                new kakao.maps.LatLng(37.56961020038914, 126.99853978727518),
              ],
            },

            {
              name: "기훈상사, 예지빌딩",
              path: [
                // 기훈상사, 예지빌딩
                new kakao.maps.LatLng(37.56979039909291, 126.99850865511642),
                new kakao.maps.LatLng(37.569758861502365, 126.99830490472753),
                new kakao.maps.LatLng(37.56974084138922, 126.9982907557631),
                new kakao.maps.LatLng(37.56960343994625, 126.99831622772724),
                new kakao.maps.LatLng(37.56948856365862, 126.99836150815355),
                new kakao.maps.LatLng(37.56948856560922, 126.99850866113454),
                new kakao.maps.LatLng(37.569598937448994, 126.9985001693263),
              ],
            },
            {
              name: "비와이상가, 밀라노",
              path: [
                // 비와이상가, 밀라노
                new kakao.maps.LatLng(37.569846714601745, 126.99879730160771),
                new kakao.maps.LatLng(37.56929485506774, 126.99881711948511),
                new kakao.maps.LatLng(37.569393968768495, 126.99936045131435),
                new kakao.maps.LatLng(37.56984221351058, 126.99927272125124),
              ],
            },
            {
              name: "b",
              path: [
                new kakao.maps.LatLng(37.56985122465456, 126.99950194134165),
                new kakao.maps.LatLng(37.56959444101853, 126.99951892226566),
                new kakao.maps.LatLng(37.5694660495681, 126.99963211765817),
                new kakao.maps.LatLng(37.56941424150212, 126.99942553797179),
                new kakao.maps.LatLng(37.56943676620505, 126.99938874957901),
                new kakao.maps.LatLng(37.56985122394204, 126.99935478764712),
              ],
            },
            {
              name: "샤넬의상실",
              path: [
                // 샤넬의상실
                new kakao.maps.LatLng(37.56985798308954, 126.99986133592918),
                new kakao.maps.LatLng(37.56985347719038, 126.99951326084194),
                new kakao.maps.LatLng(37.569727337907274, 126.99953307078115),
                new kakao.maps.LatLng(37.569716076284784, 126.9998443569505),
              ],
            },
            {
              name: "국민은행",
              path: [
                //kb국민은행
                new kakao.maps.LatLng(37.56969355062163, 126.99954439048318),
                new kakao.maps.LatLng(37.56960570371924, 126.99958683906004),
                new kakao.maps.LatLng(37.569463797203994, 126.99967456563047),
                new kakao.maps.LatLng(37.56950208986229, 126.99984718726131),
                new kakao.maps.LatLng(37.569693551394415, 126.99984152712459),
              ],
            },

            {
              name: "메가커피",
              path: [
                // 메가커피
                new kakao.maps.LatLng(37.569860235587804, 126.99986982556226),
                new kakao.maps.LatLng(37.569589936955644, 126.99987548577039),
                new kakao.maps.LatLng(37.56952686730253, 126.99990944427299),
                new kakao.maps.LatLng(37.56958092684941, 127.00022638948114),
                new kakao.maps.LatLng(37.56959894672527, 127.00024336875087),
                new kakao.maps.LatLng(37.56983095312197, 127.00020941097007),
                new kakao.maps.LatLng(37.56985347805048, 127.0001839421237),
              ],
            },
            {
              name: "대성빌딩",
              path: [
                // 대성빌딩
                new kakao.maps.LatLng(37.569950331576216, 127.00092537157438),
                new kakao.maps.LatLng(37.5698286969672, 127.00095366884842),
                new kakao.maps.LatLng(37.56986923963105, 127.0011885493574),
                new kakao.maps.LatLng(37.56988725895644, 127.00124514724581),
                new kakao.maps.LatLng(37.569970601870686, 127.00116308201878),
              ],
            },
            {
              name: "정림커텐",
              path: [
                //정림커텐
                new kakao.maps.LatLng(37.569815182035505, 127.00095366867612),
                new kakao.maps.LatLng(37.56971156732621, 127.00098196608957),
                new kakao.maps.LatLng(37.56977012887556, 127.00130740256073),
                new kakao.maps.LatLng(37.56979941097485, 127.0013300420868),
                new kakao.maps.LatLng(37.569880501188806, 127.00127344593179),
                new kakao.maps.LatLng(37.56983770529246, 127.00113761104816),
              ],
            },

            {
              name: "개미상회",
              path: [
                //개미상회
                new kakao.maps.LatLng(37.56989402187734, 127.00051220834516),
                new kakao.maps.LatLng(37.56987600263898, 127.00032260628332),
                new kakao.maps.LatLng(37.569853477812686, 127.00029996715558),
                new kakao.maps.LatLng(37.56962822883258, 127.00034241430677),
                new kakao.maps.LatLng(37.569605703842264, 127.00037637263709),
                new kakao.maps.LatLng(37.5696304805149, 127.00055465459629),
                new kakao.maps.LatLng(37.569891769413175, 127.00050654856919),
              ],
            },
            {
              name: "색동저고리",
              path: [
                // 색동저고리
                new kakao.maps.LatLng(37.56990077922985, 127.00053767731698),
                new kakao.maps.LatLng(37.569700307555294, 127.00057729409833),
                new kakao.maps.LatLng(37.56972057927868, 127.00070180870189),
                new kakao.maps.LatLng(37.56991204102411, 127.00066502204483),
              ],
            },

            {
              name: "새마을금고",
              path: [
                // 새마을금고
                new kakao.maps.LatLng(37.56991429333324, 127.00069615075724),
                new kakao.maps.LatLng(37.569783648892816, 127.0007131287984),
                new kakao.maps.LatLng(37.56979491059793, 127.00082632397017),
                new kakao.maps.LatLng(37.56992555511227, 127.00080085647953),
              ],
            },

            {
              name: "담아김밥",
              path: [
                // 담아김밥
                new kakao.maps.LatLng(37.56993231236272, 127.00083198525176),
                new kakao.maps.LatLng(37.569806172900726, 127.00084613323386),
                new kakao.maps.LatLng(37.569772385867914, 127.0008036847153),
                new kakao.maps.LatLng(37.56974760845423, 127.00080934419869),
                new kakao.maps.LatLng(37.56968679260944, 127.00058012386654),
                new kakao.maps.LatLng(37.56964399526845, 127.0005914430182),
                new kakao.maps.LatLng(37.56969805273969, 127.00093951781797),
                new kakao.maps.LatLng(37.569936817054014, 127.00087160364959),
              ],
            },
            {
              name: "우리은행, 수입구제 상가",
              path: [
                //우리은행, 수입구제 상가
                new kakao.maps.LatLng(37.57045713219646, 126.9982539506726),
                new kakao.maps.LatLng(37.570364778310086, 126.99813226720721),
                new kakao.maps.LatLng(37.57033775043684, 126.99826244315095),
                new kakao.maps.LatLng(37.570335508371215, 126.99925290717522),
                new kakao.maps.LatLng(37.570430112811856, 126.9992415866277),
                new kakao.maps.LatLng(37.57042334561318, 126.99830488966829),
              ],
            },
            {
              name: "수입구제 상가 위 삼각형",
              path: [
                // 수입구제 상가 위 삼각형
                new kakao.maps.LatLng(37.57045713632109, 126.99855958005233),
                new kakao.maps.LatLng(37.57046839476356, 126.99826244011595),
                new kakao.maps.LatLng(37.57065310068943, 126.99839544155175),
                new kakao.maps.LatLng(37.57053597167808, 126.99842374311099),
                new kakao.maps.LatLng(37.57054273073994, 126.99854825878433),
              ],
            },
            {
              name: "원제인삼",
              path: [
                // 원제인삼
                new kakao.maps.LatLng(37.570653100956996, 126.99841525091531),
                new kakao.maps.LatLng(37.57055849682427, 126.99844355197479),
                new kakao.maps.LatLng(37.57054948830905, 126.99855674836864),
                new kakao.maps.LatLng(37.57046389402625, 126.99857938923563),
                new kakao.maps.LatLng(37.570463895947334, 126.99874918335087),
                new kakao.maps.LatLng(37.57067788194299, 126.99871239094206),
              ],
            },
            {
              name: "승우네식당",
              path: [
                // 승우네식당
                new kakao.maps.LatLng(37.57067562985022, 126.99874917980996),
                new kakao.maps.LatLng(37.57050444085722, 126.99876050228664),
                new kakao.maps.LatLng(37.57044812882516, 126.99877748262779),
                new kakao.maps.LatLng(37.57043686731339, 126.9988708695415),
                new kakao.maps.LatLng(37.57068464070026, 126.99883690687773),
              ],
            },
            {
              name: "c",
              path: [
                new kakao.maps.LatLng(37.570695903471346, 126.99887086563098),
                new kakao.maps.LatLng(37.57044362509844, 126.99890482825333),
                new kakao.maps.LatLng(37.57044137518049, 126.99923026690922),
                new kakao.maps.LatLng(37.57070491618401, 126.99921045481975),
              ],
            },
            {
              name: "새마을상가",
              path: [
                //새마을상가
                new kakao.maps.LatLng(37.570274678276554, 126.99810114061475),
                new kakao.maps.LatLng(37.57007645892412, 126.9980785065489),
                new kakao.maps.LatLng(37.56989625866738, 126.99800776416708),
                new kakao.maps.LatLng(37.5697836348052, 126.99804172568106),
                new kakao.maps.LatLng(37.56979940448781, 126.99818321910719),
                new kakao.maps.LatLng(37.570067450496865, 126.99817472293564),
                new kakao.maps.LatLng(37.57017331911114, 126.99828508609822),
                new kakao.maps.LatLng(37.57029270079298, 126.99827093388382),
              ],
            },
            {
              name: "60년전통떡집",
              path: [
                // 60년전통떡집
                new kakao.maps.LatLng(37.570247651516596, 126.99830489365009),
                new kakao.maps.LatLng(37.570150794512394, 126.99830489584518),
                new kakao.maps.LatLng(37.57005844106292, 126.99820868179447),
                new kakao.maps.LatLng(37.570071963993485, 126.99885106584051),
                new kakao.maps.LatLng(37.570274687818156, 126.99883691325266),
              ],
            },
            {
              name: "종로창고",
              path: [
                // 종로창고
                new kakao.maps.LatLng(37.57004042093917, 126.99819453279655),
                new kakao.maps.LatLng(37.56981517246856, 126.99822000713009),
                new kakao.maps.LatLng(37.569846711200746, 126.99850016435792),
                new kakao.maps.LatLng(37.56988951225414, 126.99883408936199),
                new kakao.maps.LatLng(37.5700516915692, 126.9988482362656),
              ],
            },
            {
              name: "신촌꽃게장",
              path: [
                // 신촌꽃게장
                new kakao.maps.LatLng(37.570272435550585, 126.9988595524451),
                new kakao.maps.LatLng(37.570089984119754, 126.99887370466591),
                new kakao.maps.LatLng(37.56990077505466, 126.99887087763445),
                new kakao.maps.LatLng(37.569916545528336, 126.99925574124121),
                new kakao.maps.LatLng(37.57027018613454, 126.99924158824932),
              ],
            },

            {
              name: "사각형1-1",
              path: [
                // 사각형1
                new kakao.maps.LatLng(37.5702566717986, 126.99934063467917),
                new kakao.maps.LatLng(37.57019134972683, 126.9993576146047),
                new kakao.maps.LatLng(37.5701845939927, 126.99993774239023),
                new kakao.maps.LatLng(37.57027469352955, 126.99993491242046),
              ],
            },
            {
              name: "사각형1-2 갈릭보이",
              path: [
                // 사각형2 갈릭보이
                new kakao.maps.LatLng(37.57016206740727, 126.99936327463719),
                new kakao.maps.LatLng(37.57008097782125, 126.9993632753275),
                new kakao.maps.LatLng(37.57006070712209, 126.99993208272002),
                new kakao.maps.LatLng(37.570157564126156, 126.99992925274175),
              ],
            },
            {
              name: "사각형1-3 남강실크",
              path: [
                // 사각형3 남강실크
                new kakao.maps.LatLng(37.57003818053929, 126.99936327569182),
                new kakao.maps.LatLng(37.5699435760354, 126.9993661063794),
                new kakao.maps.LatLng(37.56994132521811, 126.99991510353551),
                new kakao.maps.LatLng(37.570031424758135, 126.9999122735477),
              ],
            },
            {
              name: "사각형2-1",
              path: [
                // 사각형1
                new kakao.maps.LatLng(37.57027694603591, 126.99999717010517),
                new kakao.maps.LatLng(37.5703062275389, 127.00044712356102),
                new kakao.maps.LatLng(37.57023414786528, 127.00045844270305),
                new kakao.maps.LatLng(37.57019360396272, 126.99999151032493),
              ],
            },

            {
              name: "사각형2-2 평창칼국수",
              path: [
                // 사각형2 평창칼국수
                new kakao.maps.LatLng(37.570180088152995, 127.00045561248051),
                new kakao.maps.LatLng(37.57015080585648, 127.00044146285177),
                new kakao.maps.LatLng(37.57013503841573, 127.00044712253766),
                new kakao.maps.LatLng(37.57011251336233, 127.00048957073241),
                new kakao.maps.LatLng(37.57007196958338, 127.00001414943547),
                new kakao.maps.LatLng(37.57015531165882, 127.00000282989026),
              ],
            },

            {
              name: "사각형2-3 예본한복",
              path: [
                //사각형3 예본한복
                new kakao.maps.LatLng(37.570033677279135, 127.00000565977129),
                new kakao.maps.LatLng(37.56994808271422, 127.00000565976482),
                new kakao.maps.LatLng(37.5699480824693, 127.00024054000447),
                new kakao.maps.LatLng(37.569990878910225, 127.0005065492404),
                new kakao.maps.LatLng(37.570080978523194, 127.000489570526),
                new kakao.maps.LatLng(37.570031424789065, 127.00001980919892),
              ],
            },
            {
              name: "사각형3-1",
              path: [
                //사각형1
                new kakao.maps.LatLng(37.5703062272373, 127.00052070085587),
                new kakao.maps.LatLng(37.57024766261149, 127.00050372108574),
                new kakao.maps.LatLng(37.570265680819425, 127.00080934980461),
                new kakao.maps.LatLng(37.57031974061893, 127.00079803080371),
              ],
            },

            {
              name: "사각형3-2 화개장터",
              path: [
                // 사각형2 화개장터
                new kakao.maps.LatLng(37.5701868453493, 127.00052070002478),
                new kakao.maps.LatLng(37.57015305786741, 127.00055465847147),
                new kakao.maps.LatLng(37.570139542869136, 127.0005688078195),
                new kakao.maps.LatLng(37.57012602797876, 127.00056031804932),
                new kakao.maps.LatLng(37.57015080366991, 127.00084330724243),
                new kakao.maps.LatLng(37.57020936852988, 127.00082066876442),
              ],
            },
            {
              name: "사각형3-3",
              path: [
                // 사각형3
                new kakao.maps.LatLng(37.5701012504816, 127.00058578685751),
                new kakao.maps.LatLng(37.57008323060144, 127.00058012694134),
                new kakao.maps.LatLng(37.5700787256931, 127.00056597746965),
                new kakao.maps.LatLng(37.5700111509824, 127.0005772964975),
                new kakao.maps.LatLng(37.57004493644144, 127.00088009456772),
                new kakao.maps.LatLng(37.57011926862544, 127.00087160577571),
              ],
            },
            {
              name: "삼각형 전라도횟집",
              path: [
                // 삼각형 전라도횟집
                new kakao.maps.LatLng(37.57028820558621, 127.00082632942),
                new kakao.maps.LatLng(37.57004944120414, 127.00090839348313),
                new kakao.maps.LatLng(37.57006070257338, 127.00103856840654),
              ],
            },
            {
              name: "농협은행",
              path: [
                // 농협은행
                new kakao.maps.LatLng(37.570693654107565, 126.99926705315093),
                new kakao.maps.LatLng(37.5705337275416, 126.9992840341455),
                new kakao.maps.LatLng(37.57056301108079, 126.9995189160359),
                new kakao.maps.LatLng(37.57070041280892, 126.99950476559776),
              ],
            },
            {
              name: "화창빌딩",
              path: [
                // 화창빌딩
                new kakao.maps.LatLng(37.570517960174364, 126.99929252400833),
                new kakao.maps.LatLng(37.570430113212055, 126.99930667434246),
                new kakao.maps.LatLng(37.57043236675611, 126.9995189168762),
                new kakao.maps.LatLng(37.57053372870921, 126.99951325641511),
              ],
            },
            {
              name: "합동빌딩",
              path: [
                // 합동빌딩
                new kakao.maps.LatLng(37.57041659824836, 126.9993010146675),
                new kakao.maps.LatLng(37.570299468933975, 126.9993151652406),
                new kakao.maps.LatLng(37.57030397484655, 126.9995019383268),
                new kakao.maps.LatLng(37.57040533687227, 126.99951325725065),
              ],
            },
            {
              name: "d",
              path: [
                new kakao.maps.LatLng(37.57068915049398, 126.99953589468721),
                new kakao.maps.LatLng(37.570565263670176, 126.9995443851732),
                new kakao.maps.LatLng(37.570470659170404, 126.99954721565169),
                new kakao.maps.LatLng(37.57041434690584, 126.99953306649235),
                new kakao.maps.LatLng(37.570321994858666, 126.99952740727578),
                new kakao.maps.LatLng(37.57032875297017, 126.99973398970008),
                new kakao.maps.LatLng(37.57056301187023, 126.99978775707467),
                new kakao.maps.LatLng(37.57069365615474, 126.99976794732964),
              ],
            },
            {
              name: "부촌육회",
              path: [
                //부촌육회
                new kakao.maps.LatLng(37.570707171126756, 126.99979058657672),
                new kakao.maps.LatLng(37.57058778927113, 126.999804736444),
                new kakao.maps.LatLng(37.57055174960955, 126.99995189161085),
                new kakao.maps.LatLng(37.5706959088601, 126.99994906160741),
              ],
            },
            {
              name: "e",
              path: [
                new kakao.maps.LatLng(37.570558506922865, 126.99980473652046),
                new kakao.maps.LatLng(37.57031073312314, 126.99976228872539),
                new kakao.maps.LatLng(37.570326500778044, 126.99997170103278),
                new kakao.maps.LatLng(37.57052246725595, 126.99994057201312),
              ],
            },
            {
              name: "종로우리약국",
              path: [
                // 종로우리약국
                new kakao.maps.LatLng(37.57076348344736, 127.0001301760098),
                new kakao.maps.LatLng(37.5707544735658, 126.99999151026127),
                new kakao.maps.LatLng(37.57055174961932, 127.00000282990526),
                new kakao.maps.LatLng(37.5705449920945, 127.00011885600956),
                new kakao.maps.LatLng(37.570749968497864, 127.00014715546274),
              ],
            },
            {
              name: "은성횟집",
              path: [
                // 은성회집
                new kakao.maps.LatLng(37.57052697224729, 127.00000848971293),
                new kakao.maps.LatLng(37.57033551073101, 127.00003112886772),
                new kakao.maps.LatLng(37.570342268038885, 127.00019526291506),
                new kakao.maps.LatLng(37.57051796224523, 127.00010753635075),
              ],
            },
            {
              name: "열린약국",
              path: [
                //열린약국
                new kakao.maps.LatLng(37.570754473452006, 127.0001641349491),
                new kakao.maps.LatLng(37.57054273957072, 127.00014998495993),
                new kakao.maps.LatLng(37.570590040683584, 127.00054051217855),
                new kakao.maps.LatLng(37.570763482891785, 127.00038486820286),
              ],
            },
            {
              name: "신성주단",
              path: [
                // 신성주단
                new kakao.maps.LatLng(37.570529224135974, 127.00037637728427),
                new kakao.maps.LatLng(37.57037380237333, 127.00039618579174),
                new kakao.maps.LatLng(37.57035127795812, 127.0002150722222),
                new kakao.maps.LatLng(37.57049994227719, 127.00016130448726),
              ],
            },
            {
              name: "광장시장 전골목쪽",
              path: [
                // 광장시장 전골목쪽
                new kakao.maps.LatLng(37.5705630107845, 127.00054900170024),
                new kakao.maps.LatLng(37.5704301131954, 127.0006961555582),
                new kakao.maps.LatLng(37.570394073381166, 127.00069615522274),
                new kakao.maps.LatLng(37.570378307271994, 127.00041882500508),
                new kakao.maps.LatLng(37.570517961590895, 127.00040750617123),
              ],
            },
            {
              name: "모녀김밥",
              path: [
                //모녀김밥
                new kakao.maps.LatLng(37.57031298197603, 127.00095650491942),
                new kakao.maps.LatLng(37.5701327812655, 127.00114044542553),
                new kakao.maps.LatLng(37.570202607018125, 127.0012762813079),
                new kakao.maps.LatLng(37.57031523302054, 127.0011206389334),
                new kakao.maps.LatLng(37.57032874867664, 127.0010414020253),
              ],
            },
            {
              name: "참신육회",
              path: [
                //참신육회
                new kakao.maps.LatLng(37.5703310004126, 127.00112346906653),
                new kakao.maps.LatLng(37.570218374096754, 127.0013074103959),
                new kakao.maps.LatLng(37.57023864575414, 127.00137249829838),
                new kakao.maps.LatLng(37.57024089760526, 127.00142626631592),
                new kakao.maps.LatLng(37.57034000733407, 127.00140645892519),
              ],
            },
            {
              name: "365일장",
              path: [
                //365일장
                new kakao.maps.LatLng(37.57022287769758, 127.00142626597228),
                new kakao.maps.LatLng(37.57020711084975, 127.00137815750413),
                new kakao.maps.LatLng(37.57019359643881, 127.00133287898802),
                new kakao.maps.LatLng(37.57012151834848, 127.00118855336623),
                new kakao.maps.LatLng(37.56997961034614, 127.00130457633877),
                new kakao.maps.LatLng(37.57005394071531, 127.00145456161495),
              ],
            },
            {
              name: "쑥스초코파이서울 + cu",
              path: [
                // 쑥스초코파이서울 + cu
                new kakao.maps.LatLng(37.56993681255444, 127.00134985370396),
                new kakao.maps.LatLng(37.569878247055215, 127.00141776976132),
                new kakao.maps.LatLng(37.569792651935614, 127.00146304616328),
                new kakao.maps.LatLng(37.569839950517284, 127.00173471540658),
                new kakao.maps.LatLng(37.569900766648615, 127.00180546383243),
                new kakao.maps.LatLng(37.569909779272706, 127.00162152178787),
                new kakao.maps.LatLng(37.56999312327907, 127.001474369621),
              ],
            },
            {
              name: "호남집",
              path: [
                // 호남집
                new kakao.maps.LatLng(37.570328743992484, 127.00148003603037),
                new kakao.maps.LatLng(37.57013953478388, 127.0014941817346),
                new kakao.maps.LatLng(37.570175570593506, 127.00178283133772),
                new kakao.maps.LatLng(37.570355770008774, 127.00176019645035),
              ],
            },
            {
              name: "종로본 정형외과의원",
              path: [
                // 종로본 정형외과의원
                new kakao.maps.LatLng(37.57011475719429, 127.00151116057188),
                new kakao.maps.LatLng(37.569997628007116, 127.00149417889975),
                new kakao.maps.LatLng(37.56992554661488, 127.00162718189277),
                new kakao.maps.LatLng(37.569912029264096, 127.00179414458013),
                new kakao.maps.LatLng(37.57014854081702, 127.00177717091346),
              ],
            },
            {
              name: "감탄수제누룽지 + 박가네빈대떡",
              path: [
                //감탄수제누룽지+박가네빈대떡
                new kakao.maps.LatLng(37.570795017408685, 127.00047259571308),
                new kakao.maps.LatLng(37.57035352705993, 127.00091971676724),
                new kakao.maps.LatLng(37.57081528736185, 127.0008942532084),
              ],
            },
            {
              name: "소상공인e커머스 + 육회빈대떡",
              path: [
                //소상공인E커머스, 육회빈대떡
                new kakao.maps.LatLng(37.57052471611026, 127.00092820858494),
                new kakao.maps.LatLng(37.57036929443455, 127.0009253767578),
                new kakao.maps.LatLng(37.57038956608561, 127.0010159337801),
                new kakao.maps.LatLng(37.57041433812123, 127.00151399652466),
                new kakao.maps.LatLng(37.57054047761423, 127.00150267945871),
              ],
            },
            {
              name: "새동서약국",
              path: [
                // 새동서약국
                new kakao.maps.LatLng(37.57054498240994, 127.00151682907415),
                new kakao.maps.LatLng(37.570421095404086, 127.00152814616295),
                new kakao.maps.LatLng(37.57043010229406, 127.00174887859707),
                new kakao.maps.LatLng(37.57054047430743, 127.00174322136819),
              ],
            },
            {
              name: "종로 5가 파출소",
              path: [
                //종로5가파출소
                new kakao.maps.LatLng(37.57078149404089, 127.00148853473125),
                new kakao.maps.LatLng(37.57079275365594, 127.00169794861823),
                new kakao.maps.LatLng(37.57056074695195, 127.00172624240716),
                new kakao.maps.LatLng(37.57055849730356, 127.00151965925373),
              ],
            },
            {
              name: "종로5가파출소 위",
              path: [
                //종로5가파출소 위.
                new kakao.maps.LatLng(37.570867088700396, 127.0014800466832),
                new kakao.maps.LatLng(37.5708715912673, 127.00166116148247),
                new kakao.maps.LatLng(37.570806268707166, 127.00168945918041),
                new kakao.maps.LatLng(37.570795008863, 127.00149702474357),
              ],
            },
            {
              name: "종로5가하이뷰오피스텔",
              path: [
                //종로5가하이뷰오피스텔
                new kakao.maps.LatLng(37.57081078212327, 127.00092821213508),
                new kakao.maps.LatLng(37.57054273592746, 127.00093952842818),
                new kakao.maps.LatLng(37.57056750765349, 127.00148853047254),
                new kakao.maps.LatLng(37.57084005912342, 127.00145740681913),
              ],
            },
          ],
        },
        {
          name: "인현시장", // 📌 인현시장
          path: [
            new kakao.maps.LatLng(37.5623435979591, 126.99569618639049),
            new kakao.maps.LatLng(37.56313647146205, 126.99560276316363),
            new kakao.maps.LatLng(37.563927094326054, 126.99556310152893),
            new kakao.maps.LatLng(37.56420189788564, 126.99555459623598),
            new kakao.maps.LatLng(37.564219900716516, 126.99512165631253),
            new kakao.maps.LatLng(37.56365677315145, 126.99500567761176),
            new kakao.maps.LatLng(37.563145455635585, 126.99495760811922),
            new kakao.maps.LatLng(37.56260710876862, 126.99492368914596),
            new kakao.maps.LatLng(37.562395372621154, 126.99487842996506),
          ],
          indoor: [
            {
              name: "인현시장 indoor",
              path: [
                new kakao.maps.LatLng(37.5628909333489, 126.99517833527825),
                new kakao.maps.LatLng(37.56289542947373, 126.99496611381733),
                new kakao.maps.LatLng(37.563134193421334, 126.99496326812758),
                new kakao.maps.LatLng(37.56313870738211, 126.9951783193097),
              ],
            },
          ],
        },
        /*{
          name: "중부건어물시장", // 📌 중부건어물시장
          path: [
            new kakao.maps.LatLng(37.5658575524942, 127.00150258538618),
            new kakao.maps.LatLng(37.56464120608668, 127.00162423726614),
            new kakao.maps.LatLng(37.564560126854516, 127.0004187924301),
            new kakao.maps.LatLng(37.5644520042859, 126.9990577183942),
            new kakao.maps.LatLng(37.56543408940294, 126.99896998496324),
            new kakao.maps.LatLng(37.56563230943457, 126.99907751156121),
            new kakao.maps.LatLng(37.56565033189786, 126.99949913959202),
            new kakao.maps.LatLng(37.56566159488989, 126.9996491146896),
            new kakao.maps.LatLng(37.565702139935254, 126.99973400615279),
            new kakao.maps.LatLng(37.565771967268944, 126.999804749015),
          ],
        },
        {
          name: "방산시장",
          path: [
            new kakao.maps.LatLng(37.56893445363642, 127.0014686890651),
            new kakao.maps.LatLng(37.56889391791083, 127.00011885338597),
            new kakao.maps.LatLng(37.568454682542374, 127.00012168251394),
            new kakao.maps.LatLng(37.56842990403854, 127.00052917726902),
            new kakao.maps.LatLng(37.56800868865217, 127.00050653581688),
            new kakao.maps.LatLng(37.568024454029725, 127.00086026212728),
            new kakao.maps.LatLng(37.56822942921804, 127.00102722371027),
            new kakao.maps.LatLng(37.5683600735422, 127.00103288514903),
            new kakao.maps.LatLng(37.56844791614255, 127.00145736020939),
          ],
        },
        {
          name: "명동야시장",
          path: [
            new kakao.maps.LatLng(37.560997997528254, 126.98509113345622),
            new kakao.maps.LatLng(37.56106567911781, 126.9859626202592),
            new kakao.maps.LatLng(37.56208827705452, 126.98568512906331),
            new kakao.maps.LatLng(37.562768498297025, 126.9854303339426),
            new kakao.maps.LatLng(37.56336764127526, 126.98527175778985),
            new kakao.maps.LatLng(37.56379109681798, 126.98516980704463),
            new kakao.maps.LatLng(37.56409307323349, 126.98635254543659),
            new kakao.maps.LatLng(37.56427776960165, 126.9862845997144),
            new kakao.maps.LatLng(37.56413345971158, 126.9850452340309),
            new kakao.maps.LatLng(37.56398010892009, 126.98367571088328),
            new kakao.maps.LatLng(37.563961939589795, 126.98262874215594),
            new kakao.maps.LatLng(37.563997964409474, 126.98252686612884),
            new kakao.maps.LatLng(37.563578976714155, 126.98236284478304),
            new kakao.maps.LatLng(37.563624190191064, 126.98349469138347),
            new kakao.maps.LatLng(37.563714423383274, 126.98447938848095),
            new kakao.maps.LatLng(37.56272336198344, 126.98474557733383),
            new kakao.maps.LatLng(37.5615746239614, 126.98500047245444),
          ],
        },*/
      ];

      const highlightOption = {
        fillColor: "#EDF1FF",
        fillOpacity: 0.8,
      };

      const resetOption = {
        fillColor: "#B2C3F4",
        fillOpacity: 0.7,
      };

      const allMainPolygons = [];
      const allIndoorPolygons = [];

      mainPolygons.forEach(({ name, path, indoor }) => {
        const mainPolygon = new kakao.maps.Polygon({
          path,
          strokeWeight: 3,
          strokeColor: "#6182DF",
          fillColor: resetOption.fillColor,
          fillOpacity: resetOption.fillOpacity,
        });
        mainPolygon.setMap(map);
        allMainPolygons.push(mainPolygon);

        const indoorPolygons = indoor.map(({ name: indoorName, path }) => {
          const polygon = new kakao.maps.Polygon({
            path,
            strokeWeight: 1,
            strokeColor: "#6182DF",
            fillColor: resetOption.fillColor,
            fillOpacity: resetOption.fillOpacity,
          });

          //✅ indoor polygon 클릭 이벤트
          kakao.maps.event.addListener(polygon, "click", () => {
            polygon.setOptions(highlightOption);
            setTimeout(() => polygon.setOptions(resetOption), 300);

            if (window.ReactNativeWebView) {
              if (name) {
                window.ReactNativeWebView.postMessage(
                  JSON.stringify({
                    type: "indoorClick",
                    name: name,
                  })
                );
              } else {
                console.warn("⚠️ indoor polygon 클릭됨 (name 없음)");
              }
            }
          });

          polygon.setMap(null);
          return polygon;
        });
        allIndoorPolygons.push({ name, polygons: indoorPolygons });
      });

      // 줌 이벤트 처리
      kakao.maps.event.addListener(map, "zoom_changed", function () {
        const level = map.getLevel();
        const showIndoor = level <= 1;

        allMainPolygons.forEach((polygon) =>
          polygon.setMap(showIndoor ? null : map)
        );
        allIndoorPolygons.forEach(({ polygons }) =>
          polygons.forEach((p) => p.setMap(showIndoor ? map : null))
        );
        updatePolygonVisibility();
      });

      function updatePolygonVisibility() {
        const level = map.getLevel();
        const showIndoor = level <= 1;

        allMainPolygons.forEach((polygon) =>
          polygon.setMap(showIndoor ? null : map)
        );
        allIndoorPolygons.forEach(({ polygons }) =>
          polygons.forEach((p) => p.setMap(showIndoor ? map : null))
        );
      }
    </script>
  </body>
</html>
;`;
export default htmlContent;
