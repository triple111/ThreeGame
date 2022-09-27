<?xml version="1.0" encoding="UTF-8"?>
<tileset version="1.9" tiledversion="1.9.1" name="tileobjects" tilewidth="15" tileheight="15" tilecount="4" columns="0">
 <grid orientation="orthogonal" width="1" height="1"/>
 <tile id="1">
  <image width="15" height="15" source="mapicons/rock1.png"/>
 </tile>
 <tile id="2">
  <image width="15" height="15" source="mapicons/treedark.png"/>
 </tile>
 <tile id="3">
  <image width="15" height="15" source="mapicons/treelight.png"/>
 </tile>
 <tile id="4" class="spawner">
  <properties>
   <property name="isRoaming" type="bool" value="true"/>
   <property name="maxmonsters" type="int" value="0"/>
   <property name="monstertype" value=""/>
   <property name="spawnradius" type="int" value="0"/>
  </properties>
  <image width="15" height="15" source="mapicons/spawner.png"/>
 </tile>
</tileset>
