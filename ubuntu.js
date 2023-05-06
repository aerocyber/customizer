function get_url() {
    return window.location.href;
}

function create_py_script(_script_essentials) {
    let _keys = Object.keys(_script_essentials);
    let script_head = [
        "#!/usr/bin/python3",
        "import subprocess"
    ];
    let script_body = [];
    let main = [
        "def main():",
        "    if not os.getuid() == 0:",
        '        print("Please run the script as a superuser.")',
        "        exit(1)",
        "    if not is_ubuntu():",
        '        print("The detected distro is not Ubuntu.\nInfinity is an Ubuntu-based distro.\nPlease run the script on Ubuntu.")',
        "        exit(1)",
        '    subprocess.run(["clear"])',
        '    welcome = "\\n\\n\\n+------------------------+--------------------------------------------------+\\n+    Infinity-builder    +  Make changes to Ubuntu to infinity preferences. +\\n+------------------------+--------------------------------------------------+\\n\\n"',
        '    welcome += "Steps involved\\n--------------\\n\\t* Update Cache\\n\\t*Upgrade packages\\n\\t* Do custom operations\\n\\t* Update package cache and upgrade packages\\n\\tReboot\\n\\n\\n"',
        '    print(welcome)',
        '    if input("Enter N/n to cancel the set up. Default: continue:\\t").lower() == "n":',
        '        print("User requested aborting the operation.\\nAborting...")',
        '        exit(0)',
        '    subprocess.run("sudo apt update".split(" "))',
        '    subprocess.run("sudo apt upgrade -y".split(" "))'
    ];
    let script_closing = [
        'if __name__ == "__main__":',
        "    main()"
    ]
    for (let i = 0; i < _keys.length; i++) {
        let key = _keys[i];
        if ('apt_pkgs' === key) {
            let pkg = _script_essentials['apt_pkgs'].split(',');
            let pkgs = pkg.join(' ');
            script_body.push('    subprocess.run("sudo apt install -y ' + pkgs + '")')
        }
        if ('apt-ppa' === key) {
            let ppa = _script_essentials['apt-ppa'].split(',');
            let ppas = ppa.join(' ');
            script_body.push('    subprocess.run("sudo add-apt-repository -y ' + ppas + '")')
        }
        if ('flathub-id' === key) {
            let flatpaks = _script_essentials['flathub-id'].split(',');
            let flathub_ids = ppa.join(' ');
            script_body.push('    subprocess.run("sudo add-apt-repository -y ' + flathub_ids + '")')
        }
        if ('flathub' === key) {
            if (_script_essentials['flathub']) {
                script_body.push('    subprocess.run("sudo apt install flatpak -y")')
                script_body.push('    subprocess.run("sudo flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo -y".split(" "))')
            }
        }
        if ('flatpak' === key) {
            if (_script_essentials['flatpak']) {
                script_body.push('    subprocess.run("sudo apt install flatpak -y")')
            }
        }
        if ('rem_snap' === key) {
            if (_script_essentials['rem_snap']) {
                script_body.push('    subprocess.run("sudo snap remove firefox".split(" "))')
                script_body.push('    subprocess.run("sudo snap remove snap-store".split(" "))')
                script_body.push('    subprocess.run("sudo snap remove gtk*".split(" "))')
                script_body.push('    subprocess.run("sudo snap remove gnome*".split(" "))')
                script_body.push('    subprocess.run("sudo snap remove core*".split(" "))')
                script_body.push('    subprocess.run("sudo snap remove snapd")')
                script_body.push('    subprocess.run("sudo systemctl stop snapd")')
                script_body.push('    subprocess.run("sudo apt remove --purge snapd gnome-software-plugin-snap -y")')
                script_body.push('    subprocess.run("sudo apt install -y gnome-software")')
                script_body.push('    with open("/etc/apt/preferences.d/snapless.pref", "w") as slf:\n        slf.writelines("Package: snapd\\n\\tPin: release a=*\\n\\tPin-Priority: -10\\n".split("\\t"))')
                script_body.push('    subprocess.run("sudo chown root:root /etc/apt/preferences.d/snapless.pref".split(" "))')
                script_body.push('    subprocess.run("sudo apt update")')
            }
        }
    }
    let script = script_head.join('\n');
    script += '\n' + main.join('\n');
    script += '\n' + script_body.join('\n');
    script += '\n' + script_closing.join('\n');
    console.log(script); // TODO: Remove this line
    let blob = new Blob([script]);
    console.log(blob); //TODO: Remove
    let link = document.createElement('a');
    let d = new Date();
    let dt = d.getDate().toString() + '-' + d.getMonth() + '-' + d.getFullYear() + '-' + d.getHours() + '-' + d.getMinutes() + '-' + d.getSeconds()
    link.download = 'customizer-ubuntu-' + btoa(dt) + '.py';
    link.href = URL.createObjectURL(blob);

    link.click();

    URL.revokeObjectURL(link.href);
}

function parse_url() {
    let curr_url = get_url();
    let parameters = curr_url.split('?');
    if (parameters.length > 1) {
        let val_url = parameters[1].split('&');
        let _script_essentials = {};
        for (let i = 0; i < val_url.length; i++) {
            _key = val_url[i].split('=')[0];
            _value = val_url[i].split('=')[1];
            if (_value === '') {
                _value = '';
            }
            _script_essentials[_key.toString()] = _value.toString();
        }
        for (let i = 0; i < Object.keys(_script_essentials).length; i++) {
            let _val = _script_essentials[Object.keys(_script_essentials)[i]].split(',');
            let _value = "";
            for (let x = 0; x < _val.length; x++) {
                let __val = _val[x].split('%20');
                _value += __val + ',';
            }
            _script_essentials[Object.keys(_script_essentials)[i]] = _value;
        }
        let py_file = create_py_script(_script_essentials);
    }
}

function handle_submit() {
    let rem_snap = document.getElementById('rem-snap').checked;
    let flatpak = document.getElementById('flatpak').checked;
    let flathub = document.getElementById('flathub').checked;
    if (flathub) {
        flatpak = flathub;
    }
    let flathub_id = document.getElementById("flathub-id").value;
    // let non_ppa_repos = document.getElementById("apt-repo").value;
    let ppa_repos = document.getElementById("apt-ppa").value;
    let apt_pkgs = document.getElementById("apt-pkg").value;
    let curr_url = get_url();
    // curr_url = curr_url.split('?')[0] + '?rem_snap=' + rem_snap.toString() + '&flatpak=' + flatpak.toString() + '&flathub=' + flathub.toString() + '&flathub_id=' + flathub_id + '&non_ppa_repos=' + non_ppa_repos + '&ppa_repos=' + ppa_repos + '&apt_pkgs=' + apt_pkgs;
    curr_url = curr_url.split('?')[0] + '?rem_snap=' + rem_snap.toString() + '&flatpak=' + flatpak.toString() + '&flathub=' + flathub.toString() + '&flathub_id=' + flathub_id + '&ppa_repos=' + ppa_repos + '&apt_pkgs=' + apt_pkgs;
    window.location.replace(curr_url);
}

parse_url()