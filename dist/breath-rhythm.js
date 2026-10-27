// A continuous ten-second visual guide, not a measurement of the visitor's breath.
export function breathAt(seconds){
 const phase=((seconds%10)+10)%10,inhale=phase<4;
 return {phase,inhale,amount:inhale?.5-.5*Math.cos(phase/4*Math.PI):.5+.5*Math.cos((phase-4)/6*Math.PI)};
}
