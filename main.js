cc.game.onStart = function(){
    var screenSize = cc.view.getFrameSize();
    cc.view.setDesignResolutionSize(400, 400, cc.ResolutionPolicy.SHOW_ALL);
    cc.LoaderScene.preload(gameResources, function () {
        cc.director.runScene(new GameScene());
    }, this);
};
cc.game.run();