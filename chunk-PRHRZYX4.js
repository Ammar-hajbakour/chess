import{Ma as W,c as P,h as w,r as g,v as y}from"./chunk-FKIAD4CJ.js";import{a as x,d as B}from"./chunk-XRBH25AC.js";var a=function(t){return t[t.White=0]="White",t[t.Black=1]="Black",t}(a||{}),i=function(t){return t.WhitePawn="P",t.WhiteKnight="N",t.WhiteBishop="B",t.WhiteRook="R",t.WhiteQueen="Q",t.WhiteKing="K",t.BlackPawn="p",t.BlackKnight="n",t.BlackBishop="b",t.BlackRook="r",t.BlackQueen="q",t.BlackKing="k",t}(i||{}),j={[i.WhitePawn]:"assets/pieces/white-pawn.svg",[i.WhiteKnight]:"assets/pieces/white-knight.svg",[i.WhiteBishop]:"assets/pieces/white-bishop.svg",[i.WhiteRook]:"assets/pieces/white-rook.svg",[i.WhiteQueen]:"assets/pieces/white-queen.svg",[i.WhiteKing]:"assets/pieces/white-king.svg",[i.BlackPawn]:"assets/pieces/black-pawn.svg",[i.BlackKnight]:"assets/pieces/black-knight.svg",[i.BlackBishop]:"assets/pieces/black-bishop.svg",[i.BlackRook]:"assets/pieces/black-rook.svg",[i.BlackQueen]:"assets/pieces/black-queen.svg",[i.BlackKing]:"assets/pieces/black-king.svg"},R=function(t){return t[t.Capture=0]="Capture",t[t.Castling=1]="Castling",t[t.Promotion=2]="Promotion",t[t.Check=3]="Check",t[t.CheckMate=4]="CheckMate",t[t.BasicMove=5]="BasicMove",t}(R||{});var q=function(t){return t.Active="active",t.Closed="closed",t.Finished="finish",t}(q||{}),E={1:10,2:11,3:12,4:13,5:15},_=["a","b","c","d","e","f","g","h"];var N=(()=>{let e=class e{constructor(){this.db=y(W),this.basePath="/games"}createGame(s){return B(this,null,function*(){let o="",c=yield this.db.list(this.basePath).push(s).then(n=>o=n.key).catch(n=>this.handleError(n));return o??""})}getGame(s){return this.db.object(this.basePath+"/"+s).valueChanges()}getGames(){return this.db.list(this.basePath).snapshotChanges().pipe(w(s=>s.map(o=>x({key:o.payload.key},o.payload.val()))))}updateGame(s,o){this.db.list(this.basePath).update(s,o).catch(c=>this.handleError(c))}deleteGame(s){this.db.list(this.basePath).remove(s).catch(o=>this.handleError(o))}deleteAll(){this.db.list(this.basePath).remove().catch(s=>this.handleError(s))}handleError(s){console.error(s)}};e.\u0275fac=function(o){return new(o||e)},e.\u0275prov=g({token:e,factory:e.\u0275fac,providedIn:"root"});let t=e;return t})();var u=class{constructor(e){this._color=e}get FENChar(){return this._FENChar}get directions(){return this._directions}get color(){return this._color}};var m=class extends u{get hasMoved(){return this._hasMoved}set hasMoved(e){this._hasMoved=!0}constructor(e){super(e),this.pieceColor=e,this._hasMoved=!1,this._directions=[{x:1,y:0},{x:-1,y:0},{x:0,y:1},{x:0,y:-1},{x:1,y:1},{x:1,y:-1},{x:-1,y:1},{x:-1,y:-1}],this._FENChar=e===a.White?i.WhiteKing:i.BlackKing}};var v=class extends u{get hasMoved(){return this._hasMoved}set hasMoved(e){this._hasMoved=!0,this._directions=[{x:1,y:0},{x:1,y:1},{x:1,y:-1}],this.pieceColor===a.Black&&this.setBlackPawnDirections()}constructor(e){super(e),this.pieceColor=e,this._hasMoved=!1,this._directions=[{x:1,y:0},{x:2,y:0},{x:1,y:1},{x:1,y:-1}],e===a.Black&&this.setBlackPawnDirections(),this._FENChar=e===a.White?i.WhitePawn:i.BlackPawn}setBlackPawnDirections(){this._directions=this._directions.map(({x:e,y:M})=>({x:-1*e,y:M}))}};var f=class extends u{get hasMoved(){return this._hasMoved}set hasMoved(e){this._hasMoved=!0}constructor(e){super(e),this.pieceColor=e,this._hasMoved=!1,this._directions=[{x:1,y:0},{x:-1,y:0},{x:0,y:1},{x:0,y:-1}],this._FENChar=e===a.White?i.WhiteRook:i.BlackRook}};var K=(()=>{let e=class e{convertBoardToFEN(s,o,c,n,h){let r="";for(let k=7;k>=0;k--){let p="",l=0;for(let b of s[k]){if(!b){l++;continue}l!==0&&(p+=String(l)),l=0,p+=b.FENChar}l!==0&&(p+=String(l)),r+=k===0?p:p+"/"}let d=o===a.White?"w":"b";return r+=" "+d,r+=" "+this.castlingAvailability(s),r+=" "+this.enPassantPossibility(c,o),r+=" "+n*2,r+=" "+h,r}castlingAvailability(s){let o=n=>{let h="",r=n===a.White?0:7,d=s[r][4];if(d instanceof m&&!d.hasMoved){let k=r,p=s[k][7],l=s[k][0];p instanceof f&&!p.hasMoved&&(h+="k"),l instanceof f&&!l.hasMoved&&(h+="q"),n===a.White&&(h=h.toUpperCase())}return h},c=o(a.White)+o(a.Black);return c!==""?c:"-"}enPassantPossibility(s,o){if(!s)return"-";let{piece:c,currX:n,prevX:h,prevY:r}=s;if(c instanceof v&&Math.abs(n-h)===2){let d=o===a.White?6:3;return _[r]+String(d)}return"-"}};e.initialPosition="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";let t=e;return t})();var nt=(()=>{let e=class e{constructor(){this.chessBoardState$=new P(K.initialPosition),this.lastMove$=new P(null)}};e.\u0275fac=function(o){return new(o||e)},e.\u0275prov=g({token:e,factory:e.\u0275fac,providedIn:"root"});let t=e;return t})();export{a,i as b,j as c,R as d,q as e,E as f,_ as g,N as h,u as i,m as j,v as k,f as l,K as m,nt as n};
