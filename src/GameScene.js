var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        gameLayer = new Game();
        gameLayer.init();
        this.addChild(gameLayer);
    }
});