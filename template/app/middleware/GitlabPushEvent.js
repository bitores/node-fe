

export default async (ctx, next) => {
  const deployDir = ctx.$config.deployDir;
  const {event_name,ref, user_username, project, repository} = ctx.request.body;
  // console.log(event_name,ref, user_username, project, repository)

  const repo = `${deployDir}/repo`;
  const projectName = repository.name;
  const gitUrl = repository.url;
  const branch = ref.split("\/").pop();
  let mvUrl = "", isTag = "";

  if("tag_push" === event_name) {

    isTag = true;
    mvUrl = `${deployDir}/prod/${projectName}/${branch}`;
  } else if("push"=== event_name){

    if(!['dev','daily', 'gray'].includes(branch)) {
      ctx.fail("非指定构建分支")
      return;
    } 

    isTag = false;
    mvUrl = `${deployDir}/${branch}/${projectName}`;
  }

  ctx.isTag = isTag;
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

  await next();
} 