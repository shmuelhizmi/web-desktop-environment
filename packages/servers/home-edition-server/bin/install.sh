# if apt
if [ -f /etc/debian_version ]; then
  # install build essentials
    apt-get update
    apt-get install -y build-essential
fi

# if yum
if [ -f /etc/redhat-release ]; then
  # install build essentials
    yum install -y gcc gcc-c++ make
fi

# if zypper
if [ -f /etc/SuSE-release ]; then
  # install build essentials
    zypper install -y gcc gcc-c++ make
fi

# if dnf
if [ -f /etc/dnf/dnf.conf ]; then
  # install build essentials
    dnf install -y gcc gcc-c++ make
fi

# if pacman
if [ -f /etc/arch-release ]; then
  # install build essentials
    pacman -Sy --noconfirm gcc gcc-c++ make
fi