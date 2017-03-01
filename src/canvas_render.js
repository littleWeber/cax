import Container from './container.js'
import Graphics from './graphics.js'
import Render from './render.js'

class CanvasRender extends  Render {
    constructor(canvas){
        super()
        this.ctx = canvas.getContext('2d')
    }

    render(obj){
        if(obj instanceof Graphics){
            this.renderGraphics(obj);
        }else if (obj instanceof  Container){
        }
    }

    renderGraphics(obj){

        obj.cmds.forEach(cmd => {
            const methodName = cmd[0]
            if (obj.assMethod.join("-").match(new RegExp("\\b" + methodName + "\\b", "g"))) {
                this.ctx[methodName] = cmd[1][0];
            } else if (methodName === "addColorStop") {
                obj.currentGradient && obj.currentGradient.addColorStop(cmd[1][0], cmd[1][1]);
            } else if (methodName === "fillGradient") {
                this.ctx.fillStyle = obj.currentGradient;
            } else {
                let result = this.ctx[methodName].apply(this.ctx, Array.prototype.slice.call(cmd[1]));
                if (methodName === "createRadialGradient" || methodName === "createLinearGradient") {
                    obj.currentGradient = result;
                }
            }
        })
    }
}

export default CanvasRender;