dev_pid=$(lsof -t -i:8000)

if [ -z "$dev_pid" ]
then
    echo port:8000 is free
else
    echo close port:8000 before launch
    kill $dev_pid
fi

npm install

redis-server &

npm run ui &

npm run dev
