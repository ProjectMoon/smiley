"use strict";
/* jshint browser: true, devel: true, globalstrict: true */

/*
 * External version of the smiley code because there's too much of it to
 * make it manageable.
 */

function em_drawBody(ctx, x, y, radius) {
   ctx.save();

   //unit circle makes this much easier.
   ctx.beginPath();
   
   ctx.translate(x, y);
   ctx.scale(radius, radius);
   ctx.arc(0, 0, 1, 0, Math.PI*2);

   //lighter circle up and to the left
   //darker circle centered on origin
   var rad = ctx.createRadialGradient(.5, .5, .15,
												  0, 0, 1);
	
   rad.addColorStop(0, 'rgba(255,255,0,1)');
   rad.addColorStop(.5, 'rgba(220,220,0,1)');
   rad.addColorStop(1, 'rgba(180,180,0,1)');

   ctx.fillStyle = rad;

   //skew and move slightly to make it look more like the picture
   var hSkew = .8;
   var vSkew = -.7;
   var hMove = -.3;
   var vMove = -.5;
   var hScale = 1;
   var vScale = 1;
   //originally used setTransform, but that completely
   //resets the matrix, which we do not want!
   
   ctx.transform(hScale, hSkew, vSkew, vScale, hMove, vMove);
   ctx.fill();
   ctx.restore();

   //pop got rid of the transformations that would make stroke huge
   ctx.save();
   ctx.lineWidth = 1.5;
   ctx.strokeStyle = "black";
   ctx.stroke();
   ctx.restore();    
}

function em_drawEyes(ctx, smileyX, smileyY, smileyRadius) {
   var leftX = smileyX - (smileyRadius / 3);
   var leftY = smileyY - (smileyRadius / 4);
   var rightX = smileyX + (smileyRadius / 3);
   var rightY = smileyY - (smileyRadius / 4);
   
   var height = smileyRadius * .3;
   var width = height * .35;
	
   ctx.save();
   ctx.fillStyle = "black";
   em_fillEllipse(ctx, leftX, leftY, width, height, 0);
   em_fillEllipse(ctx, rightX, rightY, width, height, 0);
   ctx.restore();
}

function em_drawSmile(ctx, smileyX, smileyY, smileyRadius) {
   //initial smiley coordinate calculations
   var xOffset = smileyRadius * .6;
   var yOffset = smileyRadius * .4;
   
   var startX = smileyX - xOffset;
   var startY = smileyY + yOffset;

   var endX = smileyX + xOffset;
   var endY = startY;

   //quadratic curve control points (top and bottom)
   var curveyFactor = 1.45;
   var controlX = (startX + endX) / 2;
   var controlY = startY + yOffset * curveyFactor;
   
   var bottomControlX = controlX;
   var bottomControlY = controlY + yOffset / 4;

   //very small lines connecting the two parts of the smiley
   //makes it less pointy at the dimples
   var lineLengthFactor = .02;
   var startBottomY = endY + (smileyRadius * lineLengthFactor);
   var endBottomY = startY + (smileyRadius * lineLengthFactor);

   ctx.save();

   ctx.lineWidth = 2;
   ctx.stroketyle = 'black';
   ctx.fillStyle = 'black';
   
   ctx.beginPath();
   ctx.moveTo(startX, startY);

   //construction process: top curve, right line, bottom curve, left line.
   //unless radius is too small because the lines don't scale well.
   //then don't use lines.
   if (smileyRadius >= 120) {
		ctx.quadraticCurveTo(controlX, controlY, endX, endY);
		ctx.lineTo(endX, startBottomY);
		ctx.quadraticCurveTo(bottomControlX, bottomControlY,
									startX, endBottomY);
		
		ctx.lineTo(startX, startY);
		ctx.closePath();
		ctx.stroke();
		ctx.fill();
   }
   else {
		ctx.quadraticCurveTo(controlX, controlY, endX, endY);
		ctx.quadraticCurveTo(bottomControlX, bottomControlY, startX, startY);
		ctx.closePath();
		ctx.stroke();
		ctx.fill();
   }

   em_drawDimples(ctx, startX, startY, endX, endY, smileyRadius);
   ctx.restore();

}

function em_drawDimples(ctx, startX, startY, endX, endY, smileyRadius) {
   var dimpleHeight = smileyRadius * .1;
   var dimpleWidth = dimpleHeight * .15;
   em_fillEllipse(ctx, startX, startY, dimpleHeight, dimpleWidth, -(Math.PI / 5));
   em_fillEllipse(ctx, endX, endY, dimpleHeight, dimpleWidth, (Math.PI / 5)); 
}

function em_drawBlood(ctx, x, y, radius) {
   ctx.save();

   ctx.translate(x, y);
   ctx.scale(radius, radius);
   ctx.beginPath();

   em_drawBloodStreak(ctx, x, y, radius);
   em_drawBloodTriangle(ctx, x, y, radius);
}

function em_drawBloodStreak(ctx, x, y, radius) {
   //main blood streak
   ctx.moveTo(-.05, .3);
   ctx.lineTo(-.7, -.6);
   
   ctx.restore();
   ctx.strokeStyle = 'red';
   ctx.lineWidth = radius / 25;
   ctx.stroke();

   //blob of blood at bottom of streak
   ctx.save();
   ctx.translate(x, y);
   ctx.scale(radius, radius);
   
   ctx.beginPath();
   ctx.translate(-.085, .25);
   ctx.rotate(Math.PI / 3.4);
   ctx.scale(.12, .037);
   ctx.arc(0, 0, 1, 0, Math.PI * 2);
   ctx.fillStyle = 'red';
   ctx.fill();
   ctx.restore();
}

function em_drawBloodTriangle(ctx, x, y, radius) {
   //triangle shape at the top of the streak
   ctx.save();
   ctx.translate(x, y);
   ctx.scale(radius, radius);

   //triangular shape at the top of the streak.
   ctx.save();
   ctx.translate(-.73, -.63);
   ctx.rotate(Math.PI / 15);
   ctx.scale(.25, .25);

   ctx.beginPath();

   //transform to make it a bit more like the picture
   ctx.transform(1.2, .5, .5, 1.2, -.03, -.08);

   //unit triangle
   ctx.moveTo(0, 0);
   ctx.lineTo(0, 1);
   ctx.lineTo(1, 0);
   ctx.lineTo(0, 0);
   ctx.fillStyle = 'red';
   ctx.fill();

   //removes the tfs/tls for the triangle
   ctx.restore();

   //arc at the top of the triangle to make it less pointy.
   ctx.save();
   ctx.rotate(Math.PI / 4);
   ctx.translate(-.93, .07);
   ctx.scale(.05, .025);
   ctx.arc(0, 0, 1, 0, Math.PI * 2);
   ctx.fillStyle = 'red';
   ctx.fill();

   ctx.restore();

   //bottom left drop (smaller)
   ctx.save();
   ctx.translate(-.65, -.35);
   ctx.rotate(Math.PI * 1.05);
   ctx.scale(.025, .05);
   ctx.arc(0, 0, 1, 0, Math.PI * 2);
   ctx.fillStyle = 'red';
   ctx.fill();
   ctx.restore();

   //bottom left drop (larger)
   ctx.save();
   ctx.translate(-.6, -.325);
   ctx.rotate(Math.PI * 1.025);
   ctx.scale(.025, .2);
   ctx.arc(0, 0, 1, 0, Math.PI * 2);
   ctx.fillStyle = 'red';
   ctx.fill();
   ctx.restore();

   //bottom right drop
   ctx.save();
   ctx.translate(-.5, -.46);
   ctx.rotate(Math.PI / 1.5);
   ctx.scale(.025, .2);
   ctx.arc(0, 0, 1, 0, Math.PI * 2);
   ctx.fillStyle = 'red';
   ctx.fill();
   ctx.restore();

   ctx.restore();
}

function em_drawSmiley(ctx, cx, cy, radius, rotation) {
   var angle = rotation || 0;
   ctx.save();
   
   if (angle != 0) {
		ctx.translate(cx, cy);
		ctx.rotate(angle);
		ctx.translate(-cx, -cy);
   }
   
   em_drawBody(ctx, cx, cy, radius);
   em_drawEyes(ctx, cx, cy, radius);
   em_drawSmile(ctx, cx, cy, radius);
   em_drawBlood(ctx, cx, cy, radius);
   ctx.restore();
}


// ================
// HELPER FUNCTIONS
// ================

function em_fillEllipse(ctx, cx, cy, halfWidth, halfHeight, angle) {
   ctx.save(); // save the current ctx state, to restore later
   ctx.beginPath();
   
   // These "matrix ops" are applied in last-to-first order
   // ..which can seem a bit weird, but actually makes sense
   //
   // After modifying the ctx state like this, it's important
   // to restore it
   ctx.translate(cx, cy);
   ctx.rotate(angle);
   ctx.scale(halfWidth, halfHeight);
   
   // Just draw a unit circle, and let the matrices do the rest!
   ctx.arc(0, 0, 1, 0, Math.PI*2);
   ctx.fill();
   
   ctx.restore();
}
