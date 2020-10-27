

export default async (ctx, next) => {
  console.log('from middleware push event', ctx.request.body)
  const {event_name,ref, user_username, project, repository} = ctx.request.body;
  // console.log(event_name,ref, user_username, project, repository)

  const repo = `${__dirname}/repo`;
  const projectName = repository.name;
  const gitUrl = repository.url;
  const branch = ref.split("\/").pop();
  const mvUrl = `${__dirname}/env/${branch}/${projectName}`;

  ctx.buildArgs = [
    repo, // clonePath
    projectName, // projectName
    gitUrl,// git path
    branch, //branch event
    mvUrl // move to path
  ]

  ctx.record = {
    actor: actor.name,
    tag: branch,
    projectName,
  }


  if("tag_push" === event_name) {
    
    
  } else if("push"=== event_name){
  //   // tag_push
  //   // push
    
  }

  await next();
} 