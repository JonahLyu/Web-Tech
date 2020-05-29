dev_pid=$(lsof -t -i:8000)

if [ -z "$dev_pid" ]
then
    echo dev server has closed
else
    echo close dev server
    kill $dev_pid
fi

ui_pid=$(lsof -t -i:3000)

if [ -z "$ui_pid" ]
then
    echo ui client has closed
else
    echo close ui client
    kill $ui_pid
fi

redis_pid=$(lsof -t -i:6379)

if [ -z "$redis_pid" ]
then
    echo redis server has closed
else
    echo close redis server
    kill $redis_pid
fi
