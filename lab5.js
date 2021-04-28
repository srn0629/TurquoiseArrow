var map;
      require([
        "esri/map", "esri/layers/FeatureLayer", 
        "esri/tasks/query", "esri/geometry/Circle",
        "esri/graphic", "esri/InfoTemplate", "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol", "esri/renderers/SimpleRenderer",
        "esri/config", "esri/dijit/LocateButton", "esri/dijit/Scalebar", "esri/Color", "dojo/dom", "dojo/parser", "dojo/domReady!"
      ], function(
        Map, FeatureLayer,
        Query, Circle,
        Graphic, InfoTemplate, SimpleMarkerSymbol,
        SimpleLineSymbol, SimpleFillSymbol, SimpleRenderer,
        esriConfig, LocateButton, Scalebar, Color, dom,
          parser
         ) {
        parser.parse();


        map = new Map("mapDiv", { 
        basemap: "osm",
      center: [-122.45, 47.25],
      zoom: 12,
          slider: false
        });

        geoLocate = new LocateButton({
        map: map
      }, "LocateButton");
      geoLocate.startup();

          var scalebar = new Scalebar({
          map: map,
          // "dual" displays both miles and kilmometers
          // "english" is the default, which displays miles
          // use "metric" for kilometers
          scalebarUnit: "dual"
        });
        
        //add the census block points in on demand mode. Note that an info template has been defined so when 
        //selected features are clicked a popup window will appear displaying the content defined in the info template.
        var featureLayer = new FeatureLayer("https://services3.arcgis.com/J1Locv0GPOt6yBRR/ArcGIS/rest/services/pt_stops_09272015/FeatureServer/0",{
          infoTemplate: new InfoTemplate("Block: ${BLOCK}", "${*}"),
          outFields: ["POP2000","HOUSEHOLDS","HSE_UNITS", "TRACT", "BLOCK"]
        });

        // selection symbol used to draw the selected census block points within the buffer polygon
        var symbol = new SimpleMarkerSymbol(
          SimpleMarkerSymbol.STYLE_CIRCLE, 
          12, 
          new SimpleLineSymbol(
            SimpleLineSymbol.STYLE_NULL, 
            new Color([247, 34, 101, 0.9]), 
            1
          ),
          new Color([207, 34, 171, 0.5])
        );
        featureLayer.setSelectionSymbol(symbol); 
        
        //make unselected features invisible
        var nullSymbol = new SimpleMarkerSymbol().setSize(0);
        featureLayer.setRenderer(new SimpleRenderer(nullSymbol));
        
        map.addLayer(featureLayer);
        
        var circleSymb = new SimpleFillSymbol(
          SimpleFillSymbol.STYLE_NULL,
          new SimpleLineSymbol(
            SimpleLineSymbol.STYLE_SHORTDASHDOTDOT,
            new Color([105, 105, 105]),
            2
          ), new Color([255, 255, 0, 0.25])
        );
        var circle;

        //when the map is clicked create a buffer around the click point of the specified distance.
        map.on("click", function(evt){
          circle = new Circle({
            center: evt.mapPoint,
            geodesic: true,
            radius: .25,
            radiusUnit: "esriMiles"
          });
          map.graphics.clear();
          map.infoWindow.hide();
          var graphic = new Graphic(circle, circleSymb);
          map.graphics.add(graphic);

          var query = new Query();
          query.geometry = circle.getExtent();
          //use a fast bounding box query. will only go to the server if bounding box is outside of the visible map
          featureLayer.queryFeatures(query, selectInBuffer);
        });

        function selectInBuffer(response){
          var feature;
          var features = response.features;
          var inBuffer = [];
          //filter out features that are not actually in buffer, since we got all points in the buffer's bounding box
          for (var i = 0; i < features.length; i++) {
            feature = features[i];
            if(circle.contains(feature.geometry)){
              inBuffer.push(feature.attributes[featureLayer.objectIdField]);
            }
          }
          var query = new Query();
          query.objectIds = inBuffer;
          //use a fast objectIds selection query (should not need to go to the server)
          featureLayer.selectFeatures(query, FeatureLayer.SELECTION_NEW, function(results){
            var totalPopulation = sumPopulation(results);
            var r = "";
            r = "<b>See map below for more details.</b>";
            dom.byId("messages").innerHTML = r;
          });
        }
        
        function sumPopulation(features) {
          var popTotal = numFeatures;
          for (var x = 0; x < features.length; x++) 
          return popTotal;
        }

      });
    