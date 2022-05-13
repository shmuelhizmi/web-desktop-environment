# install xpra

# if debian
if [ -f /etc/debian_version ]; then
    # save debian named version to variable (e.g. bullseye)
    debian_version=$(cat /etc/os-release | grep VERSION_CODENAME | cut -d '=' -f 2)
    xpra_source="deb https://xpra.org/ $debian_version main"
    # add source to sources.list if not already registered on sources.list or sources.list.d
    if ! grep -q "$xpra_source" /etc/apt/sources.list && ! grep -q "$xpra_source" /etc/apt/sources.list.d/*; then
        wget -q https://xpra.org/gpg.asc -O- | sudo apt-key add -
        sudo add-apt-repository
        sudo apt-get update
    fi
    DEBIAN_FRONTEND=noninteractive sudo apt-get install xpra -qqy --no-install-recommends
fi

# if fedora - not tested
if [ -f /etc/fedora-release ]; then
    sudo rpm --import https://xpra.org/gpg.asc
    sudo wget -O /etc/yum.repos.d/xpra.repo https://xpra.org/repos/Fedora/xpra.repo
    sudo dnf install xpra -y
fi
# centos - not tested
if [ -f /etc/centos-release ]; then
    sudo rpm --import https://xpra.org/gpg.asc
    sudo wget -O /etc/yum.repos.d/xpra.repo https://xpra.org/repos/CentOS/xpra.repo
    sudo dnf install xpra -y
fi
