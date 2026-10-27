// A continuous ten-second visual guide, not a measurement of the visitor's breath.
export function breathAt(seconds,inhaleSeconds=4){
 const phase=((seconds%10)+10)%10,inhale=phase<inhaleSeconds;
 return {phase,inhale,amount:inhale?.5-.5*Math.cos(phase/inhaleSeconds*Math.PI):.5+.5*Math.cos((phase-inhaleSeconds)/(10-inhaleSeconds)*Math.PI)};
}
