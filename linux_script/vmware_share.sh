# �鿴����Ŀ¼
vmware-hgfsclient
# share
# other

# ���ڹ���Ŀ¼
mount -t vmhgfs .host:/share /mnt/hgfs
mount -t vmhgfs .host:/other /mnt/hgfs

# Error: cannot mount filesystem: No such device
yum install open-vm-tools-devel -y
vmhgfs-fuse .host:/share /mnt/hgfs
