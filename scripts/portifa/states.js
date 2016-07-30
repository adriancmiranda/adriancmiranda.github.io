export const states = [{
  name:'flux',
  title:'Flux',
  route:['', '/flux'],
  templateUrl:'./views/flux.html',
  // template:'',
  // module:'',
  // controller:'app.views.FluxView',
  // controllerUrl:'',
  // enabled:false,
  data:{
    roles:[]
  }
},{
  name:'archives',
  title:'Archives',
  route:'/archives',
  templateUrl:'./views/archives.html',
  data:{
    roles:[]
  }
},{
  name:'contact',
  title:'Contact',
  route:'/contact',
  templateUrl:'./views/contact.html',
  data:{
    roles:[]
  },
  children:[{
    name:'developer',
    title:'Contact Adrian',
    route:'/dev',
    templateUrl:'./views/contact.developer.html',
    data:{
      roles:[]
    }
  },{
    name:'designer',
    title:'Contact Andrey',
    route:'/designer',
    templateUrl:'./views/contact.designer.html',
    data:{
      roles:[]
    }
  },{
    name:'ambox',
    title:'Contact the brothers',
    route:'/brothers',
    templateUrl:'./views/contact.ambox.html',
    data:{
      roles:[]
    }
  }]
},{
  name:'about',
  title:'About',
  route:'/about',
  templateUrl:'./views/about.html',
  data:{
    roles:[]
  }
},{
  name:'about.project',
  title:'About the project',
  route:'/project',
  templateUrl:'./views/about.project.html',
  data:{
    roles:[]
  }
},{
  name:'about.authors',
  title:'About the authors',
  route:'/authors',
  templateUrl:'./views/about.authors.html',
  data:{
    roles:[]
  }
},{
  name:'about.authors.developer',
  title:'About Adrian',
  route:'/dev',
  templateUrl:'./views/about.authors.developer.html',
  data:{
    roles:[]
  }
},{
  name:'about.authors.designer',
  title:'About Andrey',
  route:'/designer',
  templateUrl:'./views/about.authors.designer.html',
  data:{
    roles:[]
  }
}];
