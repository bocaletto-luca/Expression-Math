 "use strict";
    
    // TAB NAVIGATION
    function openTab(evt, tabName) {
      const tabcontents = document.getElementsByClassName("tabcontent");
      for (let i = 0; i < tabcontents.length; i++) {
        tabcontents[i].style.display = "none";
        tabcontents[i].classList.remove("active");
      }
      const tablinks = document.getElementsByClassName("tablinks");
      for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
      }
      document.getElementById(tabName).style.display = "block";
      document.getElementById(tabName).classList.add("active");
      evt.currentTarget.classList.add("active");
    }
    document.getElementById("defaultTab").click();
    
    /* ----- EXPRESSION EVALUATOR ----- */
    function evaluateExpression() {
      const expr = document.getElementById("exprInput").value;
      const resultDiv = document.getElementById("evalResult");
      try {
        // Use Function constructor to safely evaluate the expression.
        let result = Function('"use strict"; return (' + expr + ')')();
        resultDiv.innerHTML = `<p>Result: ${result}</p>`;
      } catch(e) {
        resultDiv.innerHTML = `<p>Error in expression: ${e.message}</p>`;
      }
    }
    
    /* ----- GRAPHING FUNCTIONS ----- */
    function graphFunction() {
      const exprStr = document.getElementById("graphExpr").value;
      const resultDiv = document.getElementById("graphResult");
      const canvas = document.getElementById("graphCanvas");
      const ctx = canvas.getContext("2d");
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create a function f(x) from the input.
      try {
        const f = new Function("x", `"use strict"; return (${exprStr});`);
        
        // Set graph range.
        const xMin = -10, xMax = 10;
        let yMin = Infinity, yMax = -Infinity;
        const samples = 1000;
        let pts = [];
        
        // Sample the function over [xMin, xMax].
        for (let i = 0; i <= samples; i++){
          let x = xMin + (xMax - xMin) * i / samples;
          let y = f(x);
          pts.push({x, y});
          if (y < yMin) yMin = y;
          if (y > yMax) yMax = y;
        }
        
        // If function is constant, adjust yMin and yMax.
        if (yMin === yMax) { yMin -= 1; yMax += 1; }
        
        // Transform function: Map x in [xMin, xMax] to [margin, canvas.width-margin]
        // and y in [yMin, yMax] to [canvas.height-margin, margin] (inverted).
        const margin = 40;
        const plotWidth = canvas.width - 2 * margin;
        const plotHeight = canvas.height - 2 * margin;
        function transform(pt) {
          const X = margin + ((pt.x - xMin) / (xMax - xMin)) * plotWidth;
          const Y = canvas.height - margin - ((pt.y - yMin) / (yMax - yMin)) * plotHeight;
          return {X, Y};
        }
        
        // Draw axes.
        ctx.strokeStyle = "#333";
        ctx.lineWidth = 1;
        // x-axis (y=0 if in range)
        if (yMin <= 0 && yMax >= 0) {
          let p1 = transform({x: xMin, y: 0});
          let p2 = transform({x: xMax, y: 0});
          ctx.beginPath();
          ctx.moveTo(p1.X, p1.Y);
          ctx.lineTo(p2.X, p2.Y);
          ctx.stroke();
        }
        // y-axis (x=0 if in range)
        if (xMin <= 0 && xMax >= 0) {
          let p1 = transform({x: 0, y: yMin});
          let p2 = transform({x: 0, y: yMax});
          ctx.beginPath();
          ctx.moveTo(p1.X, p1.Y);
          ctx.lineTo(p2.X, p2.Y);
          ctx.stroke();
        }
        
        // Plot the function.
        ctx.strokeStyle = "#007BFF";
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < pts.length; i++){
          let {X, Y} = transform(pts[i]);
          if (i === 0) ctx.moveTo(X, Y);
          else ctx.lineTo(X, Y);
        }
        ctx.stroke();
        
        ctx.fillStyle = "#000";
        ctx.font = "12px Arial";
        ctx.fillText(`f(x) = ${exprStr}`, margin + 10, margin - 10);
        resultDiv.innerHTML = `<p>Graph of f(x)=${exprStr} for x ∈ [${xMin}, ${xMax}]</p>`;
      } catch(e) {
        resultDiv.innerHTML = `<p>Error in function expression: ${e.message}</p>`;
      }
    }
