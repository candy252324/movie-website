module.exports=function (grunt) {
  grunt.initConfig({
    watch: {
      jade: {
        files: ['views/**'],
        options: {
          livereload: true   // livereload设为ture, 则当被监听的文件发生改变时将重新启动服务
        }
      },
      js: {
        files: ['public/js/**', 'models/**/*.js', 'schemas/**/*.js'],
        //tasks: ['jshint'],  // 语法检查
        options: {
          livereload: true
        }
      },
      uglify: {
        files: ['public/**/*.js'],
        tasks: ['jshint'],
        options: {
          livereload: true
        }
      },
      styles: {
        files: ['public/**/*.less'],
        tasks: ['less'],
        options: {
          nospawn: true
        }
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc',  //检查时依赖的文件
        ignores: ['public/libs/**/*.js']  // 忽略语法检查的文件
      },
      all: ['public/js/*.js', 'test/**/*.js', 'app/**/*.js']
    },

    less: {
      development: {
        options: {
          compress: true,
          yuicompress: true,
          optimization: 2
        },
        files: {
          'public/build/index.css': 'public/less/index.less'
        }
      }
    },

    uglify: {
      development: {
        files: {
          'public/build/admin.min.js': 'public/js/admin.js',
          'public/build/detail.min.js': [
            'public/js/detail.js'
          ]
        }
      }
    },

    nodemon: {
      dev: {    // dev,开发环境
        options: {
          file: 'app.js',
          args: [],
          ignoredFiles: ['README.md', 'node_modules/**', '.DS_Store'],
          watchedExtensions: ['js'],
          watchedFolders: ['./'],
          debug: true,
          delayTime: 1,  // 文件发生变动时，等待多少毫秒才重启
          env: {
            PORT: 3000
          },
          cwd: __dirname,   // 目录配置为当前目录
        }
      }
    },

    mochaTest: {
      options: {
        reporter: 'spec'
      },
      src: ['test/**/*.js']   // 要测试的目录
    },

    concurrent: {
      tasks: ['nodemon', 'watch', 'less', 'uglify', 'jshint'],  // 通过tasks 传入5个任务
      options: {
        logConcurrentOutput: true
      }
    }
  })
  grunt.loadNpmTasks("grunt-contrib-watch")  //grunt-contrib-watch插件，只要有文件发生变动，便会执行注册好的相应任务
  grunt.loadNpmTasks("grunt-nodemon")  //grunt-nodemon插件，实时监听app.js文件，发生变动则重启
  grunt.loadNpmTasks("grunt-concurrent")  //grunt-concurrent，针对慢任务（如sass,less编译）的插件，优化构建时间
  grunt.loadNpmTasks("grunt-mocha-test")  //单元测试
  grunt.loadNpmTasks("grunt-contrib-less")  //less编译
  grunt.loadNpmTasks("grunt-contrib-uglify")  //js压缩
  grunt.loadNpmTasks("grunt-contrib-jshint")  //语法检查

  grunt.option('force',true)  //设为ture,则不会因为一些语法错误/警告而中断整个grunt任务

  grunt.registerTask("default",['concurrent'])  //注册一个concurrent任务

  grunt.registerTask("test",['mochaTest'])  // 注册测试任务
}