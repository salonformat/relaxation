// Scene-specific procedural ambience. Precipitation and wind follow the controls.
export function ambienceFor(state,time,breath=0){
 const sea=state.place==='sea',lake=state.place==='country',room=state.place==='city',winter=state.season==='winter',rain=state.weather==='rain'&&!winter;
 const surge=(.5+.5*Math.sin(time*.58-1.3))**1.7;
 const drift=.78+.13*Math.sin(time*.137)+.09*Math.sin(time*.233+2),level=winter?.72:1;
 const gust=.5+.5*Math.sin(time*.21+.35*Math.sin(time*.071));
 const lap=(.5+.5*Math.sin(time*.83+Math.sin(time*.19)))**2;
 const leaves=state.wind&&!winter?(state.season==='autumn'?.045:.026)*(.65+.35*gust):0;
 return {gains:{
  depth:sea?(.24+surge*.12)*level:lake?.09*level:0,
  wash:sea?(.22+surge*.36+breath*.045)*drift*level:lake?.065*level:0,
  foam:sea?(.024+surge*.075)*drift*level:0,
  lapping:lake?(.085+lap*.09)*level:0,
  rain:rain?(room?.18:.15)*(.9+.1*Math.sin(time*.19)):0,
  rainRoof:rain?(room?.12:.035):0,
  leaves:room?0:leaves,
  drops:rain?(room?.40:.25):0,
  wind:state.wind?(room?.025+gust*.018:sea?.09+gust*.065:.075+gust*.055)*(winter?.72:1):0
 },filters:{wash:sea?700+surge*1000+breath*180:380+lap*240,foam:1300+surge*950,rain:room?2100:4200,wind:room?240:winter?340:sea?550:680,leaves:state.season==='autumn'?1700:1250,lapping:380+lap*500},winter};
}
