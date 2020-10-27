
// {
//   "eventKey":"repo:refs_changed",
//   "date":"2020-06-18T12:33:15+0800",
//   "actor":{
//       "name":"hzj@mochongsoft.com",
//       "emailAddress":"hzj@zmjx.com",
//       "id":210,
//       "displayName":"黄政杰",
//       "active":true,
//       "slug":"hzj_mochongsoft.com",
//       "type":"NORMAL"
//   },
//   "repository":{
//       "slug":"test-fe-ci",
//       "id":177,
//       "name":"test-fe-ci",
//       "scmId":"git",
//       "state":"AVAILABLE",
//       "statusMessage":"Available",
//       "forkable":true,
//       "project":{
//           "key":"FE",
//           "id":69,
//           "name":"fe",
//           "public":false,
//           "type":"NORMAL"
//       },
//       "public":false
//   },
//   "changes":[
//       {
//           "ref":{
//               "id":"refs/heads/master",
//               "displayId":"master",
//               "type":"BRANCH"
//           },
//           "refId":"refs/heads/master",
//           "fromHash":"e717c7ab9b4af797eaaa0eaa1c6cc37feb95acf9",
//           "toHash":"2c8d800855380cf89e0c4ffe9299ac0b1a2c818e",
//           "type":"UPDATE"
//       }
//   ]
// }
export default async (ctx, next) => {
  const deployDir = ctx.$config.deployDir;
  const {repository, actor, changes} = ctx.request.body;
  
  const repo = `${deployDir}/repo`;
  const eventType = changes[0].ref.type;
  const group = repository.project.key;
  const projectName = `${repository.name}`;
  const branch =  changes[0].ref.displayId;
  const gitUrl = `ssh://git@bitbucket.zmjx.club:7999/${group}/${projectName}.git`;
  let mvUrl = "", isTag = "";
  if("TAG" === eventType) {

    isTag = true;
    mvUrl = `${deployDir}/prod/${group}/${projectName}/${branch}`;
  } else if("BRANCH"=== eventType){
    
    
    if(!['dev','daily', 'gray', 'master'].includes(branch)) {
      ctx.fail("非指定构建分支")
      return;
    } 
    isTag = false;
    mvUrl = `${deployDir}/${branch}/${group}/${projectName}`;
  }
  ctx.isTag = isTag;
  ctx.buildArgs = [
    `${repo}/${group}`, // clonePath
    projectName, // projectName
    gitUrl,// git path
    branch, //branch event
    mvUrl, // move to path
  ]

  ctx.record = {
    actor: actor.displayName,// actor.name,
    tag: branch,
    projectName,
  }

  

 await next();
} 