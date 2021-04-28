require([
        "esri/map", 
        "esri/dijit/InfoWindowLite",
        "esri/InfoTemplate", "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/layers/FeatureLayer",
        "esri/dijit/LocateButton",
        "esri/dijit/Scalebar",
        "dojo/dom-construct",
        "dojo/parser",
        "dojo/domReady!"
      ], function(
          Map,
          InfoWindowLite,
          InfoTemplate, SimpleMarkerSymbol,
          SimpleLineSymbol,
          FeatureLayer,
          LocateButton,
          Scalebar,
          domConstruct,
          parser
         ) {
        parser.parse();

    var map = new Map("mapDiv", { 
        basemap: "topo",
        center: [-122.45, 47.25],
        zoom: 10,
        slider: false,
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

        var infoWindow = new InfoWindowLite(null, domConstruct.create("div", null, null, map.root));
        infoWindow.startup();
        map.setInfoWindow(infoWindow);

        var template = new InfoTemplate();
        template.setTitle("Garden: <b>${Garden_Name}");
        template.setContent("Cost per bed, per season: $${Price_Per_Lot__Per_Season}<br>Number of Beds: ${BEDS}<br>Gather/Play area: ${GatherPlay}<br>Accessible: ${accessible}<br>Contact: ${contactname}");

        //add a layer to the map
        var featureLayer = new FeatureLayer("https://services3.arcgis.com/J1Locv0GPOt6yBRR/arcgis/rest/services/HarvestGardens/FeatureServer/0", {
          mode: FeatureLayer.MODE_ONDEMAND,
          infoTemplate:template,
          outFields: ["Garden_Name","contactname","Phone_Number","email","website","Price_Per_Lot__Per_Season","accessible","languages","BEDS","fruittrees","GatherPlay"]
        });
        map.addLayer(featureLayer);

        map.infoWindow.resize(200, 75);
      });