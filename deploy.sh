sudo su

source_root='/var/todo'

# 建立一个软连接
sudo ln -s -f ${source_root}/todo.conf /etc/supervisor/conf.d/todo.conf
# 不要再 sites-available 里面放任何东西

sudo ln -s -f /home/ubuntu/to-do-list/todo.conf /etc/supervisor/conf.d/todo.conf
sudo ln -s -f /home/ubuntu/to-do-list/todo.nginx /etc/nginx/sites-enabled/todo

# 重启服务器
sudo service supervisor restart


# service supervisor status
# ls /var/log/supervisor

sudo echo 'deploy success'
