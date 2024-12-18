// 초기 사용자 프로필 설정
const defaultProfile = {
    id: 'RYUJI',
    img: 'assets/default_profile.png',
    name: '류지현',
    description: `엘리스 Node.js 백엔드 개발 트랙`,
    link: "https://github.com/ryuji-dev/instagram",
    posts: 0,
    followers: 98,
    following: 127,
};

// DOM 요소 선택
const profileImg = document.getElementById('profile-img');
const profileId = document.getElementById('profile-id');
const profilePosts = document.getElementById('profile-posts');
const profileFollwers = document.getElementById('profile-followers');
const profileFollowing = document.getElementById('profile-following');
const profileName = document.getElementById('profile-name');
const profileDescription = document.getElementById('profile-description');
const profileLink = document.getElementById('profile-link');

const updateProfileImg = document.getElementById('update-profile-img');
const updateProfileId = document.getElementById('update-profile-id');
const updateProfileName = document.getElementById('update-profile-name');
const updateProfileDescription = document.getElementById('update-profile-description');
const updateProfileFile = document.getElementById('update-profile-file');
const updateProfileSave = document.getElementById('update-profile-save');
const updateProfileLink = document.getElementById('update-profile-link');
const updateProfileBtn = document.getElementById('update-profile-btn');
const updateProfileModal = document.querySelector('.update-profile-modal');
const updateProfileCloseBtn = updateProfileModal.querySelector('.modal__close-btn');

// 페이지 로드 시 이벤트 초기화 및 UI 업데이트
window.addEventListener('load', () => {
    initEvents();
    updateProfileUI();
    updatePostsUI();
})

// 이벤트 초기화 함수
const initEvents = () => {
    updateProfileBtn.addEventListener('click', () => updateProfileModal.showModal());
    updateProfileSave.addEventListener('click', handleUpdateProfileSave);
    updateProfileCloseBtn.addEventListener('click', () => updateProfileUI());
    updateProfileFile.addEventListener('change', handleFileInputChangeProfile);

    // 모달 바깥 부분 클릭 시 모달 닫기
    updateProfileModal.addEventListener('click', (e) => {
        if(e.target === updateProfileModal) {
            updateProfileModal.close();
        }
    })
};

// UI 업데이트 함수
const updateUI = () => {
    updateProfileUI();
};

// 프로필 UI 업데이트 함수
const updateProfileUI = () => {
    const profile = JSON.parse(localStorage.getItem('profile')) || defaultProfile;
    const posts = JSON.parse(localStorage.getItem('posts')) || [];

    document.title = `${profile.name}(@${profile.id})) • Instagram`;
    profile.posts = posts.length;

    profileImg.setAttribute('src', profile.img);
    profileId.innerText = profile.id;
    profilePosts.querySelector('strong').innerText = profile.posts;
    profileFollwers.querySelector('strong').innerText = profile.followers;
    profileFollowing.querySelector('strong').innerText = profile.following;
    profileName.innerText = profile.name;
    profileDescription.innerText = profile.description;
    profileLink.innerText = profile.link;
    profileLink.setAttribute('href', profile.link);

    updateProfileImg.setAttribute('src', profile.img);
    updateProfileId.value = profile.id;
    updateProfileName.value = profile.name;
    updateProfileDescription.value = profile.description;
    updateProfileLink.value = profile.link;
};

// 프로필 저장 처리 함수
const handleUpdateProfileSave = () => {
    const { id, img, name, description, link, ...rest } = JSON.parse(localStorage.getItem('profile')) || defaultProfile;

    const newProfile = {
        id: updateProfileId.value,
        img: updateProfileImg.getAttribute('src'),
        name: updateProfileName.value,
        description: updateProfileDescription.value,
        link: updateProfileLink.value,
        ...rest,
    };

    localStorage.setItem('profile', JSON.stringify(newProfile));
    updateProfileUI();
};

// 프로필 이미지 파일 입력 변경 처리 함수
const handleFileInputChangeProfile = function () {
    const fr = new FileReader();

    fr.readAsDataURL(this.files[0]);

    fr.onload = () => {
        updateProfileImg.setAttribute('src', fr.result);
    };
};

// 열린 다이얼로그 확인 함수
const whichDialogOpen = () => {
    const allDialogs = Array.from(document.querySelectorAll('dialog.post-modal'));
    if (!allDialogs) return;

    const openedDialog = allDialogs.find(({ open }) => open);
    return openedDialog && openedDialog.parentNode.id;
};