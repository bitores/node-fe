#!/bin/sh


#   ./build.sh clonePath projectName gitUrl tagOrBranch movePath
#   存放路径：clonePath/projectName
#   $1 = clonePath  ../xx/FE
#   $2 = projectName    test
#   $3 = gitUrl     ssh://...
#   $4 = tagOrBranch
#   $5 = movePath

#   mkdir -p 有则忽略，没有则创建


# 权限不购 git npm
# printf 输出
if ! [ -x "$(command -v git)" ]; then
  printf 'Error: git 未安装.' >&2
  exit 1
fi

# printf 输出
if ! [ -x "$(command -v npm)" ]; then
  printf 'Error: npm 未安装.' >&2
  exit 1
fi

mkdir -p $1;

cd $1;

if [ ! -d $2 ]; then
    git clone $3 1>/dev/null;
    

    if [ $? -ne 0 ]; then #
      printf "Clone 项目 ...error"
      exit 1
    fi
    printf 'Clone 项目 ...ok'
fi

cd $2;

# 文件是否有变更
if [ -n "$(git status -s)" ];then
    # 解决合并冲突，如 Unmerged paths 问题,放弃所有服务端因异常引导的文件变更
    git reset --hard FETCH_HEAD;
    # 清理所有变化（新增、删除、修改），恢复原样  -d 未被添加的， -f 强制 -x 忽略文件, -n 参数会提示删掉哪些文件
    git checkout . && git clean -xdf 1>/dev/null;
    if [ $? -ne 0 ]; then #
      printf "清理部署机上的文件变更 ...error"
      exit 1
    fi
    printf '清理部署机上的文件变更 ...ok'
fi

# 拉新， && 保证所有的命令执行完毕后，
# 这里要添加判断（todo） 是否要切换分支 branch=$(git symbolic-ref HEAD | sed -e 's,.*/\(.*\),\1,')
# or branch=`git branch | grep "*"`;${branch:2}

if [ "$(git symbolic-ref HEAD | sed -e 's,.*/\(.*\),\1,')" != $4 ]; then
    
    git checkout $4 1>/dev/null; 
    if [ $? -ne 0 ]; then #
      printf "切换分支失败"
      exit 1
    fi
    printf  "切换至 $4 ... ok"
fi

git pull origin $4  1>/dev/null; #2>/dev/null

if [ $? -ne 0 ]; then #
  printf "拉取最新代码 ...error"
  exit 1
fi
printf '拉取最新代码 ...ok'

# --unsafe-perm， 遇到 node-gyp 问题，要考虑是否要升级node 版本了
# npm 出于安全考虑不支持以 root 用户运行，即使你用 root 用户身份运行了，npm 会自动转成一个叫 nobody 的用户来运行，而这个用户几乎没有任何权限。这样的话如果你脚本里有一些需要权限的操作，比如写文件（尤其是写 /root/.node-gyp），就会崩掉了。
# 为了避免这种情况，要么按照 npm 的规矩来，专门建一个用于运行 npm 的高权限用户；要么加 --unsafe-perm 参数，这样就不会切换到 nobody 上，运行时是哪个用户就是哪个用户，即使是 root。
npm install --unsafe-perm 1>/dev/null; #2>/dev/null

if [ $? -ne 0 ]; then #
  printf "安装依赖 ...error"
  exit 1
fi
printf '安装依赖 ...ok'

if [ -n "$(cat package.json | grep -E \"build\"\S*:)" ]; then
  npm run build  1>/dev/null; #2>/dev/null
  
  if [ $? -ne 0 ]; then #
    printf "build 构建 ...error"
    exit 1
  fi

  printf 'build 构建 ...ok'
else printf 'package.json中缺少 build 命令' >&1;
fi

mkdir -p $5; 

if [ ! -d "dist" ]; then
  printf "没有找到 dist 目录" >&2;
  exit 1
fi

cp -r dist/* $5 2>&1 1>/dev/null;
printf '拷贝 dist 到指定位置 ...ok'
exit 0