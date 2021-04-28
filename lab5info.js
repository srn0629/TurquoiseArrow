require([
        "esri/map", 
        "esri/dijit/InfoWindowLite",
        "esri/InfoTemplate", "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/layers/FeatureLayer",
        "dojo/dom-construct",
        "dojo/domReady!"
      ], function(
          Map,
          InfoWindowLite,
          InfoTemplate, SimpleMarkerSymbol,
          SimpleLineSymbol,
          FeatureLayer,
          domConstruct
         ) {

    var map = new Map("mapDiv", { 
        basemap: "osm",
        center: [-122.45, 47.25],
        zoom: 11,
        slider: false,
        });

        var infoWindow = new InfoWindowLite(null, domConstruct.create("div", null, null, map.root));
        infoWindow.startup();
        map.setInfoWindow(infoWindow);

        var template = new InfoTemplate();
        template.setTitle("Pierce Transit Stop <b>${stop_id}");
        template.setContent("On the ${location} side of ${descrip} near ${landmark}.");

        //add a layer to the map
        var featureLayer = new FeatureLayer("https://services3.arcgis.com/J1Locv0GPOt6yBRR/ArcGIS/rest/services/pt_stops_09272015/FeatureServer/0", {
          mode: FeatureLayer.MODE_ONDEMAND,
          infoTemplate:template,
          outFields: ["stop_id","location","landmark","descrip"]
        });
        map.addLayer(featureLayer);

        map.infoWindow.resize(200, 75);
      });