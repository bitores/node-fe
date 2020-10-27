

export default (config={})=>async (ctx, next)=>{
  ctx.checkBody(config);

  const result = await  ctx.getValidationResult();
  if(!result.isEmpty()) {
    return ctx.fail(result.array())
  } 


  await next();
}