while true
do
  echo "[$(date)] Running worker"
  node worker.js
  sleep 10
done
