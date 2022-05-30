cc.game.onStart = function(){
    var screenSize = cc.view.getFrameSize();
    cc.view.setDesignResolutionSize(300, 300, cc.ResolutionPolicy.SHOW_ALL);
    cc.LoaderScene.preload(gameResources, function () {
        cc.director.runScene(new gameScene());
    }, this);
};
cc.game.run();