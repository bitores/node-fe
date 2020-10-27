"use strict";

CT.lineFont = (function() {
   var codes = [
   [' ',[
   ]],
   ['!',[
      [[0,1],[0,-.2]],
      [[0,-1],-4,[.1,-.9]],
   ]],
   ['"',[
      [[.25,1],[.25,.4]],
      [[-.25,1],[-.25,.4]],
   ]],
   ['#',[
      [[0,1],[-.4,-1]],
      [[.4,1],[0,-1]],
      [[-.5,.25],[.5,.25]],
      [[-.5,-.25],[.5,-.25]],
   ]],
   ['$',[
      [[.5,.4],1,[0,.8],-2,[-.5,.4],-2,[.5,-.4],-1,[-.5,-.4]],
      [[0,-1],[0,1]],
   ]],
   ['%',[
      [[-.25,.35],-4,[-.15,.45]],
      [[.25,-.35],-4,[.35,-.45]],
      [[-.5,-.3],[.5,.3]],
   ]],
   ['&',[
      [[.6,-.5],1,[-.2,-1.1],-2,[-.9,-.5],-3.5,[.15,.49],[.6,-1.09]],
   ]],
   ['\'',[
      [[.15,1],[-.15,.5]],
   ]],
   ['(',[
      [[.2,-1.2],-2,[-.2,0]],
   ]],
   [')',[
      [[-.2,-1.2],-2,[.2,0]],
   ]],
   ['*',[
      [[0,-.5],[0,.5]],
      [[-.5,-.25],[.5,.25]],
      [[-.5,.25],[.5,-.25]],
   ]],
   ['+',[
      [[0,.5],[0,-.5]],
      [[-.5,0],[.5,0]],
   ]],
   [',',[
      [[0,-.75],[-.3,-1.25]],
   ]],
   ['-',[
      [[-.5,0],[.5,0]],
   ]],
   ['.',[
      [[0,-1],-4,[.1,-.9]],
   ]],
   ['/',[
      [[-.5,-1],[.5,1]],
   ]],
   ['0',[
      [[-.65,0],4,[0,1]],
   ]],
   ['1',[
      [[-.35,.6],[.05,1],[.05,-1]],
   ]],
   ['2',[
      [[-.6,.4],2,[0,1],1,[0,-.2],-1,[-.6,-.8],[-.6,-1],[.6,-1]],
   ]],
   ['3',[
      [[-.6,1],[.6,1],[0,.2],-2.8,[.7,-.4]],
   ]],
   ['4',[
      [[.6,-.3],[-.8,-.3],[.2,1],[.2,-1]],
   ]],
   ['5',[
      [[.55,1],[-.65,1],[-.65,.2],[-.05,.2],-2.8,[.65,-.4]],
   ]],
   ['6',[
      [[-.65,-.4],4,[0,.2],[-.65,.4],1.5,[.06,1]],
   ]],
   ['7',[
      [[-.65,1],[.55,1],[-.05,-1]],
   ]],
   ['8',[
      [[0,.1],-4,[.55,.55],-4,[.7,-.45]],
   ]],
   ['9',[
      [[.65,.4],4,[0,-.2],[.65,-.4],1.5,[-.06,-1]],
   ]],
   [':',[
      [[0,0],-4,[.1,.1]],
      [[0,-1],-4,[.1,-.9]],
   ]],
   [';',[
      [[0,0],-4,[.1,.1]],
      [[0,-.75],[-.3,-1.25]],
   ]],
   ['<',[
      [[.5,.5],[-.5,0],[.5,-.5]],
   ]],
   ['=',[
      [[-.5,.25],[.5,.25]],
      [[-.5,-.25],[.5,-.25]],
   ]],
   ['>',[
      [[-.5,.5],[.5,0],[-.5,-.5]],
   ]],
   ['?',[
      [[-.5,.5],2,[0,1],1,[.25,.1],-1,[0,-.3]],
      [[0,-1],-4,[.1,-.9]],
   ]],
   ['@',[
      [[0,-1],-3,[-.8,0],1,[.8,-.3],1,[.6,-.5],-1,[.4,0],4,[0,-.6]],
   ]],
   ['A',[
      [[-.7,-1],[0,1],[.7,-1]],
      [[-.35,0],[.35,0]],
   ]],
   ['B',[
      [[-.7,-1],[-.7,1],[0,1],-2,[.5,.5],[-.7,0],[-0,0],-2,[.6,-.5],[-.7,-1]],
   ]],
   ['C',[
      [[.8,.5],1,[0,1],-2,[-1,0],-1,[.8,-.5]],
   ]],
   ['D',[
      [[-.7,-1],[-.7,1],[0,1],-2,[.9,0],[-.7,-1]],
   ]],
   ['E',[
      [[.8,1],[-.8,1],[-.8,-1],[.8,-1]],
      [[-.8,0],[.4,0]],
   ]],
   ['F',[
      [[.8,1],[-.8,1],[-.8,-1]],
      [[-.8,0],[.4,0]],
   ]],
   ['G',[
      [[.8,.4],1,[0,1],-2,[-.9,0],-1,[.8,-.2],[0,-.2]],
   ]],
   ['H',[
      [[-.7,1],[-.7,-1]],
      [[.7,1],[.7,-1]],
      [[-.7,0],[.7,0]],
   ]],
   ['I',[
      [[0,1],[0,-1]],
      [[-.5,1],[.5,1]],
      [[-.5,-1],[.5,-1]],
   ]],
   ['J',[
      [[0,1],[0,-.5],2,[-.5,-1]],
      [[-.5,1],[.5,1]],
   ]],
   ['K',[
      [[-.7,1],[-.7,-1]],
      [[.7,1],[-.7,0]],
      [[-.7,0],[.7,-1]],
   ]],
   ['L',[
      [[-.7,1],[-.7,-1],[.7,-1]],
   ]],
   ['M',[
      [[-.7,-1],[-.7,1],[0,0],[.7,1],[.7,-1]],
   ]],
   ['N',[
      [[-.7,-1],[-.7,1],[.7,-1],[.7,1]],
   ]],
   ['O',[
      [[-.87,0],4,[0,1]],
   ]],
   ['P',[
      [[-.7,-1],[-.7,1],[0,1],-2,[.5,.5],[-.7,0]],
   ]],
   ['Q',[
      [[-.9,0],4,[-.1,1]],
      [[.2,-.4],[.8,-1]],
   ]],
   ['R',[
      [[-.7,-1],[-.7,1],[0,1],-2,[.5,.5],[-.7,0]],
      [[.1,0],[.6,-1]],
   ]],
   ['S',[
      [[.7,.5],1,[0,1],-2,[-.7,.5],-2,[.7,-.5],-1,[-.7,-.5]],
   ]],
   ['T',[
      [[0,1],[0,-1]],
      [[-.7,1],[.7,1]],
   ]],
   ['U',[
      [[-.7,1],[-.7,-.3],2,[0,-1],[.7,1]],
   ]],
   ['V',[
      [[-.7,1],[0,-1],[.7,1]],
   ]],
   ['W',[
      [[-.8,1],[-.4,-1],[0,0],[.4,-1],[.8,1]],
   ]],
   ['X',[
      [[-.7,1],[.7,-1]],
      [[-.7,-1],[.7,1]],
   ]],
   ['Y',[
      [[-.7,1],[0,0],[.7,1]],
      [[0,0],[0,-1]],
   ]],
   ['Z',[
      [[-.7,1],[.7,1],[-.7,-1],[.7,-1]],
   ]],
   ['[',[
      [[.2,1.2],[-.2,1.2],[-.2,-1.2],[.2,-1.2]],
   ]],
   ['\\',[
      [[-.5,1],[.5,-1]],
   ]],
   [']',[
      [[-.2,1.2],[.2,1.2],[.2,-1.2],[-.2,-1.2]],
   ]],
   ['^',[
      [[-.3,.7],[0,1],[.3,.7]],
   ]],
   ['_',[
      [[-1,-1.2],[1,-1.2]],
   ]],
   ['`',[
      [[-.15,1],[.15,.5]],
   ]],
   ['a',[
      [[.6,-1],[.6,.4],[0,.4],-3,[-.6,-.3]],
   ]],
   ['b',[
      [[-.6,1],[-.6,-1],[0,-1],-3,[.6,-.3]],
   ]],
   ['c',[
      [[.6,.2],1,[0,.4],-2,[-.6,-.3],-1,[.6,-.8]],
   ]],
   ['d',[
      [[.6,1],[.6,-1],[0,-1],-3,[-.6,-.3]],
   ]],
   ['e',[
      [[-.6,-.3],[.6,-.3],3,[0,.4],-1,[.5,-.8]],
   ]],
   ['f',[
      [[-.3,-1],[-.3,.6],2,[.1,1]],
      [[-.6,0],[.2,0]],
   ]],
   ['g',[
      [[-.6,-1.2],2,[0,-1.6],[.6,.4],[0,.4],-3,[-.6,-.3]],
   ]],
   ['h',[
      [[-.55,1],[-.55,-1]],
      [[-.55,-.1],2,[0,.4],[.55,-1]],
   ]],
   ['i',[
      [[-.3,.4],[-.3,-.7],2,[0,-1]],
      [[-.3,1],-4,[-.2,1.1]],
   ]],
   ['j',[
      [[-.8,-1.2],2,[-.3,-1.6],[.2,.4]],
      [[.2,1],-4,[.3,1.1]],
   ]],
   ['k',[
      [[-.5,1],[-.5,-1]],
      [[.4,.3],[-.5,-.3],[.5,-1]],
   ]],
   ['l',[
      [[-.2,1],-1,[0,.8],[0,-.8],1,[.2,-1]],
   ]],
   ['m',[
      [[-.7,-1],[-.7,.4]],
      [[-.7,-.1],2,[-.35,.4],[0,-1]],
      [[0,-.1],2,[.35,.4],[.7,-1]],
   ]],
   ['n',[
      [[-.55,-1],[-.55,.4]],
      [[-.55,-.1],2,[0,.4],[.55,-1]],
   ]],
   ['o',[
      [[-.7,-.3],4,[0,.4]],
   ]],
   ['p',[
      [[-.6,-1.6],[-.6,.4],[.05,.4],-3,[.7,-.3]],
   ]],
   ['q',[
      [[.85,-1.4],2,[.65,-1.6],[.45,.4],[-.15,.4],-3,[-.75,-.3]],
   ]],
   ['r',[
      [[-.55,-1],[-.55,.4]],
      [[-.55,-.1],2,[0,.4]],
   ]],
   ['s',[
      [[.55,.1],1,[0,.4],-2,[-.55,.05],-2,[.55,-.65],-1,[-.55,-.7]],
   ]],
   ['t',[
      [[-.3,.7],[-.3,-.7],2,[0,-1]],
      [[-.6,.4],[.3,.4]],
   ]],
   ['u',[
      [[-.55,.4],[-.55,-.5],2,[0,-1]],
      [[.55,.4],[.55,-1]],
   ]],
   ['v',[
      [[-.55,.4],[0,-1],[.55,.4]],
   ]],
   ['w',[
      [[-.8,.4],[-.4,-1],[0,-.3],[.4,-1],[.8,.4]],
   ]],
   ['x',[
      [[-.55,.4],[.55,-1]],
      [[-.55,-1],[.55,.4]],
   ]],
   ['y',[
      [[-.55,.4],[0,-1]],
      [[-.26,-1.6],[.6,.4]],
   ]],
   ['z',[
      [[-.55,.4],[.55,.4],[-.55,-1],[.55,-1]],
   ]],
   ['{',[
      [[.4,1.2],-1,[0,.8],1,[-.4,0],-1,[0,-.8],1,[.4,-1.2]],
   ]],
   ['|',[
      [[0,1],[0,-1]],
   ]],
   ['}',[
      [[-.4,1.2],-1,[0,.8],1,[.4,0],-1,[0,-.8],1,[-.4,-1.2]],
   ]],
   ['~',[
      [[-.6,-.1],[-.2,.1],[.2,-.1],[.6,.1]],
   ]],
   ['\u00ac',[
      [[-.7,.4],[.7,.4],[.7,-.4]],
   ]],
   ['\u00b1',[
      [[0,.5],[0,-.3]],
      [[-.5,.1],[.5,.1]],
      [[-.5,-.7],[.5,-.7]],
   ]],
   ['\u00b2',[
      [[-.7,1.7],2,[-.4,2],1,[-.4,1.4],-1,[-.7,1],[-.1,1]],
   ]],
   ['\u00b3',[
      [[-.6,2],[0,2],[-.3,1.6],-2.8,[.05,1.3]],
   ]],
   ['\u03a3',[
      [[.8,-1],[-.8,-1],[0,0],[-.8,1],[.8,1]],
   ]],
   ['\u03b1',[
      [[-.8,-.3],1.8,[-.2,-1],[.67,.38]],
      [[-.8,-.3],1.8,[-.2,.4],[.55,-.93],2,[.7,-1.03]],
   ]],
   ['\u03b2',[
      [[-.5,-1.5],[-.5,.6],3,[0,1],-2.5,[.7,-.4]],
   ]],
   ['\u03b5',[
      [[.6,.1],3,[0,.45],-3,[-.6,-.6]],
   ]],
   ['\u03b8',[
      [[-.8,0],4,[0,1]],
      [[-.8,0],[.8,0]],
   ]],
   ['\u03c0',[
      [[.6,.4],[-.5,.4],-.5,[-.9,0]],
      [[-.4,.4],[-.4,-.6],1,[-.6,-1]],
      [[.3,.4],[.3,-.6],1.5,[.6,-1]],
   ]],
   ['\u03c6',[
      [[-.87,0],4,[0,.7]],
      [[.3,1.1],[-.3,-1.1]],
   ]],
   ['\u2022',[
      [[-.1,0],4,[0,.09]],
      [[-.3,0],4,[0,.26]],
   ]],
   ['\u2074',[
      [[0,1.4],[-.7,1.4],[-.2,2.05],[-.2,1.05]],
   ]],
   ['\u2093',[
      [[-.6,-.5],[ .4,-1.5]],
      [[ .4,-.5],[-.6,-1.5]],
   ]],
   ['\u2094',[
      [[-.5,-.5],[-.1,-1.1]],
      [[ .3,-.5],[-.3,-1.5]],
   ]],
   ['\u2095',[
      [[-.6,-.5],[.4,-.5],[-.6,-1.5],[.4,-1.5]],
   ]],
   ['\u2264',[
      [[.5,.6],[-.5,.3],[.5,0]],
      [[.5,-.6],[-.5,-.6]],
   ]],
   ['\u2265',[
      [[-.5,.6],[.5,.3],[-.5,0]],
      [[-.5,-.6],[.5,-.6]],
   ]],
   ['\u8592',[
      [[-.5,.1],[-.8,-.2],[-.5,-.5]],
      [[-.8,-.2],[.8,-.2]],
   ]],
   ['\u8593',[
      [[-.3,.3],[0,.6],[.3,.3]],
      [[0,.6],[0,-1]],
   ]],
   ['\u8594',[
      [[.5,.1],[.8,-.2],[.5,-.5]],
      [[.8,-.2],[-.8,-.2]],
   ]],
   ['\u8595',[
      [[-.3,-.7],[0,-1],[.3,-.7]],
      [[0,-1],[0,.6]],
   ]],
   ];
   return ([8, 1]).map(
      function(N) {
         var glyphs = [];
         for (var i = 0 ; i < codes.length ; i++) {
            var index = codes[i][0].charCodeAt(0);
            var code  = codes[i][1];
            glyphs[index] = [];
            for (var j = 0 ; j < code.length ; j++)
               glyphs[index].push(pathCodeToCurve(code[j], N));
         }
         return glyphs;
      }
   );
})();


