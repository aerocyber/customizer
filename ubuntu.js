function get_url() {
    return window.location.href;
}

function create_py_script(_script_essentials) {
    if(flathub-id in _script_essentials.keys()){
        // TODO: add flatpak apps from flathub
    }

    if(apt-repo in _script_essentials.keys()){
        // TODO: add apt repositories
    }

    if (apt-ppa in _script_essentials.keys()){
        // TODO: add apt repositories from launchpad
    }

    if (apt-pkg in _script_essentials.keys()){
        // TODO: add apt packages
    }
}

function parse_url() {
    let curr_url = get_url();
    let parameters = curr_url.split('?');
    if (parameters.length > 1) {
        let val_url = parameters[1].split('&');
        let _script_essentials = {};
        for (let i = 0; i < val_url.length; i++){
            _key = val_url[i].split('=')[0];
            _value = val_url[i].split('=')[1];
            if (_value === '') {
                _value = '';
            }
            _script_essentials[_key] = _value;
        }
        let py_file = create_py_script(_script_essentials);
    }
}

function handle_submit() {
    let rem_snap = document.getElementById('rem-snap');
    let flatpak = document.getElementById('flatpak');
    let flathub = document.getElementById('flathub');
    let flathub_id = document.getElementById("flathub-id").value;
    let non_ppa_repos = document.getElementById("apt-repo").value;
    let ppa_repos = document.getElementById("apt-ppa").value;
    let apt_pkgs = document.getElementById("apt-pkg").value;
    let curr_url = get_url();
    curr_url += '?rem_snap=' + rem_snap.toString() + '&flatpak=' + flatpak.toString() + '&flathub='+ flathub.toString() + '&flathub_id=' + flathub_id + '&non_ppa_repos=' + non_ppa_repos + '&ppa_repos=' + ppa_repos + '&apt_pkgs=' + apt_pkgs;
    window.location.replace(curr_url);
}