var terminal = Object.create(new Shell({
    
    profile: Profile,
    commands: Commands,
    fs: 'system/file.json'

})).startup(function () {
    
    this
        
        .queue('login')
        .queue('adriancmiranda')
        .queue('********')
        .queue('cat README.md')
        .queue('help')
        .queue('cd projects')
        .queue('ls -l')
        .queue('cd ..')
        .queue('tree')
        .queue('ls')

    .run();

});