alias la='ls -la'
alias git check='git checkout'

alias proxy_dev='export http_proxy=http://web-proxy.tencent.com:8080; export https_proxy=https://web-proxy.tencent.com:8080'

# 办公机专用
alias proxy_office='export http_proxy=http://proxy.tencent.com:8080; export https_proxy=https://proxy.tencent.com:8080'

# 取消所有代理设置
alias unproxy='unset all_proxy; unset http_proxy; unset https_proxy'

#alias gr='grep -rIn --color'
#alias gri='grep -rIin --color'
#alias gre='grep -rIn --color=auto --exclude-dir={.bzr,CVS,.git,.hg,.svn,node_modules}'

function gr() {
    if [ $# == 1 ]
    then
        grep -rIn --color $1 ./ --exclude-dir=.git
    elif [ $# == 2 ]
    then
        if [[ $2 =~ \-.* ]]
        then
            grep -rIn --color $1 ./ $2
        else
            grep -rIn --color $1 $2
        fi
    else
        grep -rIn --color $*
    fi
}
function gri() {
    if [ $# == 1 ]
    then
        grep -rIin --color $1 ./
    elif [ $# == 2 ]
    then
        if [[ $2 =~ \-.* ]]
        then
            grep -rIn --color $1 ./ $2
        else
            grep -rIn --color $1 $2
        fi
    else
        grep -rIin --color $*
    fi
}
function grn() {
    if [ $# == 1 ]
    then
        grep -rIin --color $1 ./ --exclude-dir=node_modules
    else
        if [[ $2 =~ \-.* ]]
        then
            if [ $# == 2 ]
            then
                grep -rIin --color $1 ./ $2 --exclude-dir=node_modules
            fi
        else
            if [ $# == 2 ]
            then
                grep -rIin --color $1 $2 --exclude-dir=node_modules
            else
                grep -rIin --color $* --exclude-dir=node_modules
            fi
        fi
    fi
}
function gre() {
    if [ $# == 1 ]
    then
        grep -h
    elif [ $# == 2 ]
    then
        echo "grep -rIn --color $1 ./ --exclude-dir={.git,$2}"
        grep -rIn --color $1 ./ --exclude-dir=$2
    else
        p12=$1' '$2
        pall=$*
        params=${pall:${#p12}:$#}
        grep -rIn --color $1 ./ --exclude-dir={.git,$2} params
    fi
}

alias rm='rm -i'

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

export HOMEBREW_NO_AUTO_UPDATE=1
export HOMEBREW_BOTTLE_DOMAIN=https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles

[ -f /usr/local/etc/profile.d/autojump.sh ] && . /usr/local/etc/profile.d/autojump.sh

# If you come from bash you might have to change your $PATH.
# export PATH=$HOME/bin:/usr/local/bin:$PATH

# Path to your oh-my-zsh installation.
export ZSH="/Users/coffeebi/.oh-my-zsh"

# Set name of the theme to load --- if set to "random", it will
# load a random theme each time oh-my-zsh is loaded, in which case,
# to know which specific one was loaded, run: echo $RANDOM_THEME
# See https://github.com/robbyrussell/oh-my-zsh/wiki/Themes
ZSH_THEME="robbyrussell"

# Set list of themes to pick from when loading at random
# Setting this variable when ZSH_THEME=random will cause zsh to load
# a theme from this variable instead of looking in ~/.oh-my-zsh/themes/
# If set to an empty array, this variable will have no effect.
# ZSH_THEME_RANDOM_CANDIDATES=( "robbyrussell" "agnoster" )

# Uncomment the following line to use case-sensitive completion.
# CASE_SENSITIVE="true"

# Uncomment the following line to use hyphen-insensitive completion.
# Case-sensitive completion must be off. _ and - will be interchangeable.
# HYPHEN_INSENSITIVE="true"

# Uncomment the following line to disable bi-weekly auto-update checks.
# DISABLE_AUTO_UPDATE="true"

# Uncomment the following line to change how often to auto-update (in days).
# export UPDATE_ZSH_DAYS=13

# Uncomment the following line to disable colors in ls.
# DISABLE_LS_COLORS="true"

# Uncomment the following line to disable auto-setting terminal title.
# DISABLE_AUTO_TITLE="true"

# Uncomment the following line to enable command auto-correction.
# ENABLE_CORRECTION="true"

# Uncomment the following line to display red dots whilst waiting for completion.
# COMPLETION_WAITING_DOTS="true"

# Uncomment the following line if you want to disable marking untracked files
# under VCS as dirty. This makes repository status check for large repositories
# much, much faster.
# DISABLE_UNTRACKED_FILES_DIRTY="true"

# Uncomment the following line if you want to change the command execution time
# stamp shown in the history command output.
# You can set one of the optional three formats:
# "mm/dd/yyyy"|"dd.mm.yyyy"|"yyyy-mm-dd"
# or set a custom format using the strftime function format specifications,
# see 'man strftime' for details.
# HIST_STAMPS="mm/dd/yyyy"

# Would you like to use another custom folder than $ZSH/custom?
# ZSH_CUSTOM=/path/to/new-custom-folder

# Which plugins would you like to load?
# Standard plugins can be found in ~/.oh-my-zsh/plugins/*
# Custom plugins may be added to ~/.oh-my-zsh/custom/plugins/
# Example format: plugins=(rails git textmate ruby lighthouse)
# Add wisely, as too many plugins slow down shell startup.
plugins=(
  # git,
  # node
)

source $ZSH/oh-my-zsh.sh

# User configuration

# export MANPATH="/usr/local/man:$MANPATH"

# You may need to manually set your language environment
# export LANG=en_US.UTF-8

# Preferred editor for local and remote sessions
# if [[ -n $SSH_CONNECTION ]]; then
#   export EDITOR='vim'
# else
#   export EDITOR='mvim'
# fi

# Compilation flags
# export ARCHFLAGS="-arch x86_64"

# ssh
# export SSH_KEY_PATH="~/.ssh/rsa_id"

# Set personal aliases, overriding those provided by oh-my-zsh libs,
# plugins, and themes. Aliases can be placed here, though oh-my-zsh
# users are encouraged to define aliases within the ZSH_CUSTOM folder.
# For a full list of active aliases, run `alias`.
#
# Example aliases
# alias zshconfig="mate ~/.zshrc"
# alias ohmyzsh="mate ~/.oh-my-zsh"

alias ssh238='ssh -p36000 coffeebi@10.12.90.238'

alias staff='networksetup -setairportnetwork en0 Tencent-StaffWiFi'
alias office='networksetup -setairportnetwork en0 Tencent-OfficeWiFi'
alias rwifi='networksetup -setairportpower en0 off && networksetup -setairportpower en0 on'

