# 查看共享目录
vmware-hgfsclient
# share
# other

# 挂在共享目录
mount -t vmhgfs .host:/share /mnt/hgfs
mount -t vmhgfs .host:/other /mnt/hgfs

# Error: cannot mount filesystem: No such device
yum install open-vm-tools-devel -y
vmhgfs-fuse .host:/share /mnt/hgfs
