if !has("gui_running")
  set t_Co=256
  set term=screen-256color
endif


syntax enable
syntax on
filetype on
filetype plugin on
filetype indent on

"set nobackup    "设置不产生.swp
set directory=~/.vim/tmp    "设备swp保存路径
set t_Co=256	"显示256色
set number		"显示行号
set history=1000	"设置记录数
set cc=81           "设置80列高亮
"`:hi colorcolumn guifg=white guibg = green
:hi colorColumn cterm=NONE ctermbg=darkred ctermfg=white guibg=darkred guifg=white
set nowrap          "不换行
set cursorline		"突出显示当前行
set ruler		"突出显示状态栏标尺
set laststatus=2	"显示状态栏

"set ignorecase		"搜索忽略大小写
set hlsearch		"搜索时高亮结果

"设置缩进
set tabstop=2		"tab 键长度 4
"set smartindent
set expandtab
"set softtabstop=4
"set shiftwidth=4
set shiftwidth=2             "换行时行间交错使用4空格
set cindent shiftwidth=2     "自动缩进4空格
autocmd BufWritePre * if(search('\s\+$') > 0) | %s/\s\+$// | endif "删除行尾空格
"autocmd BufWritePre,FileWritePre *.js if(search(';\+$') > 0) | %s/;\+$// | endif "删除行尾分号
"
"开启折叠，并设置空格来开关折叠
set nofoldenable
"set foldmethod=manual
"set foldcolumn=2
"setlocal foldlevel=1
 "set foldclose=all
" nnoremap <space> @=((foldclosed(line('.'))<0)?'zc':'zo')<CR>
"搜索和undo时不展开设置好的折叠
" set foldopen+=search
" set foldopen+=undo

"设置空格 tab占位符
set list
set listchars=tab:>-,trail:-

set nocompatible         "be improved, required
filetype off            "required

"set the runtime path to include Vundele and initialize

set rtp+=~/.vim/bundle/Vundle.vim
call vundle#begin()
Plugin 'VundleVim/Vundle.vim'
Plugin 'editorconfig/editorconfig-vim'  "This is an EditorConfig plugin for Vim
"Plugin 'vim-scripts/taglist.vim'
"Plugin 'scrooloose/nerdtree'		"目录树管理
" Plugin 'vim-scripts/winmanager'	"窗口管理
Plugin 'tomasr/molokai'			"主题管理
Plugin 'vim-airline/vim-airline'	"状态栏管理
Plugin 'mattn/emmet-vim'			"
"Plugin 'easymotion/vim-easymotion'	"快速搜索
"Plugin 'kien/ctrlp.vim'			"缓存区文件搜索
"Plugin 'altercation/solarized'		"主题管理，暂不能用
Plugin 'vim-scripts/AutoComplPop'
Plugin 'MarcWeber/vim-addon-mw-utils'
Plugin 'tomtom/tlib_vim'
Plugin 'garbas/vim-snipmate'
Plugin 'honza/vim-snippets'
"Plugin 'Valloric/YouCompleteMe'	"自动补齐插件
Plugin 'vim-syntastic/syntastic'    " 语法检查
"Plugin 'scrooloose/syntastic'       "语法检查
Plugin 'maksimr/vim-jsbeautify'     "js格式化
Plugin 'pangloss/vim-javascript'   "js缩进 语法高亮
"Plugin 'vim-scripts/jsbeautify'    "js格式化
Plugin 'php.vim'                   "php 高亮
Plugin 'groenewege/vim-less'        "less高亮
Plugin 'hail2u/vim-css3-syntax'     "css语法高亮
"Plugin 'skammer/vim-css-color'      "css语法
"Plugin 'Shutnik/jshint2.vim'
Plugin 'sekel/vim-vue-syntastic'
"Plugin 'posva/vim-vue'             "vue高亮
Plugin 'terryma/vim-multiple-cursors'
" Plugin 'editorconfig/editorconfig-vim'
Plugin 'heavenshell/vim-jsdoc'      "生成jsdoc的
" Plugin 'godlygeek/tabular'          " markdown 高亮
" Plugin 'plasticboy/vim-markdown'    " markdown 高亮
Plugin 'tpope/vim-markdown'
Plugin 'leafgarland/typescript-vim'

call vundle#end()		"required
filetype plugin indent on 	"required

"molokai options
let g:molokai_original = 1
let g:rehash256 = 1
colorscheme molokai

"airline options
let g:airline#extensions#tabline#enable =1
let g:airline#extensions#ctrlp#show_adjacent_modes = 1
let g:airline#extensions#nerdtree#enable = 1
let g:airline_detect_modified=1
let g:airline_detect_paste=1
let g:airline_detect_crypt=1
let g:airline_detect_spell=1
let g:airline_exclude_preview = 0

"vim-script  options
"jsDoc
let g:javascript_plugin_jsdoc = 1
"NGDoc
let g:javascript_plugin_ngdoc = 1
"
"let g:user_emmet_expandabbr_key = '<c-space>'
"let g:use_emmet_complete_tag=1
 let g:user_emmet_expandabbr_key='<ctrl-;>'   "This maps the expansion to Ctrl-space
   let g:use_emmet_complete_tag=1

let g:user_emmet_mode='a'    "enable all function in all mode.
let g:user_emmet_install_global = 0
autocmd FileType html,css,phtml EmmetInstall

"jsbeautify
 ".vimrc
 map <c-f> :call JsBeautify()<cr>
 " or
 autocmd FileType javascript noremap <buffer>  <c-f> :call JsBeautify()<cr>
 " for json
 autocmd FileType json noremap <buffer> <c-f> :call JsonBeautify()<cr>
 " for jsx
 autocmd FileType jsx noremap <buffer> <c-f> :call JsxBeautify()<cr>
 " for html
 autocmd FileType html noremap <buffer> <c-f> :call HtmlBeautify()<cr>
 " for css or scss
 autocmd FileType css noremap <buffer> <c-f> :call CSSBeautify()<cr>
 autocmd FileType scss noremap <buffer> <c-f> :call CSSBeautify()<cr>
 autocmd FileType less noremap <buffer> <c-f> :call CSSBeautify()<cr>
"binding a function for js, html and css in visual mode on
autocmd FileType javascript vnoremap <buffer>  <c-f> :call RangeJsBeautify()<cr>
autocmd FileType json vnoremap <buffer> <c-f> :call RangeJsonBeautify()<cr>
autocmd FileType jsx vnoremap <buffer> <c-f> :call RangeJsxBeautify()<cr>
autocmd FileType html vnoremap <buffer> <c-f> :call RangeHtmlBeautify()<cr>
autocmd FileType css vnoremap <buffer> <c-f> :call RangeCSSBeautify()<cr>
autocmd FileType scss vnoremap <buffer> <c-f> :call RangeCSSBeautify()<cr>
autocmd FileType less vnoremap <buffer> <c-f> :call RangeCSSBeautify()<cr>

au BufNewFile,BufRead *.vue setf html
au bufread,bufnewfile *.vue noremap <buffer>  <c-f> :call RangeJsBeautify()<cr>


"set runtimepath+=~/.vim/bundle/jshint2.vim/
"let jshint2_command = '~/path/to/node_modules/.bin/jshint'
"let jshint2_save = 1
"let jshint2_close = 0
"let jshint2_confirm = 0
"let jshint2_max_height = 12

"syntastic options
let g:syntastic_javascript_checkers = ['jshint']
"set statusline+=%#warningmsg#
"set statusline+=%{SyntasticStatuslineFlag()}
"set statusline+=%*
"let g:syntastic_always_populate_loc_list = 0
"let g:syntastic_auto_loc_list = 0
"let g:syntastic_check_on_open = 0
"let g:syntastic_check_on_w = 0
"let g:syntastic_check_on_wq = 0

"vim-vue-syntastic options
"based on Syntastic ESlint vim-vue
"let g:syntastic_javascript_checkers = ['eslint']
"let g:syntastic_vue_checkers = ['eslint']
"let local_eslint = finddir('node_modules', '.;') . '/.bin/eslint'
"if matchstr(local_eslint, "^\/\\w") == ''
"    let local_eslint = getcwd() . "/" . local_eslint
"endif
"if executable(local_eslint)
"     let g:syntastic_javascript_eslint_exec = local_eslint
"     let g:syntastic_vue_eslint_exec = local_eslint
"endif



" vim-snipmate options
"let g:acp_behaviorSnipmateLength = 1


" jsdoc options
let g:jsdoc_enable_es6 = 1
let g:jsdoc_input_description = 1
let g:jsdoc_allow_input_prompt = 1
let g:jsdoc_additional_descriptions = 1
let g:jsdoc_allow_shorthand = 1


"skammer/vim-css-color options
"let g:cssColorVimDoNotMessMyUpdatetime = 1

" markdown options
autocmd BufNewFile,BufReadPost *.md set filetype=markdown
let g:markdown_fenced_languages = ['html', 'python', 'javascript', 'bash=sh', 'css']
let g:markdown_minlines = 100
let g:markdown_syntax_conceal = 0
