#!/usr/local/bin/ruby
require 'cgi'

unless defined? WIKK_CONF
  load '/wikk/etc/wikk.conf'
end
require "#{RLIB}/authlib.rb" # Doesn't exit yet!!!!

def params(cgi)
  '<h2>Params</h2>' +
    if cgi.params.length > 0
      cgi.params.collect do |k, v|
        "#{k} => [#{v.join(',')}]<br>\n"
      end.join('')
    else
      'none'
    end
end

def cookies(cgi)
  '<H2>Cookies</H2>' +
    if cgi.cookies.length > 0
      cgi.cookies.collect do |k, v|
        "#{k} => #{v}<br>\n"
      end.join('')
    else
      'none'
    end
end

def environment(_cgi)
  '<h1>Environment</h2>' +
    if ENV.length
      ENV.collect do |k, v|
        "#{k} => #{v}<br>\n"
      end.join('')
    else
      'none'
    end
end

def authenticated(cgi)
  '<h1>Authenticated</h2><ul>' +
    (Authenticated.authenticated?(cgi) ? 'True' : 'False') +
    '</ul'
end

cgi = CGI.new('html3')
cgi.out do
  cgi.html do
    cgi.head { cgi.title { 'Test RBX' } } +
      cgi.body do
        "<h1>CGI response test</h1>\n" +
          params(cgi) + cookies(cgi) + environment(cgi) + authenticated(cgi)
      end
  end
end
