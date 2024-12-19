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

// 게시물 관련 DOM 요소 선택
const postModal = document.querySelector('.post-modal');
const addPost = document.querySelector('#add-post');
const addPostModal = document.querySelector('.add-post-modal');
const addPostModalPost = document.querySelector('.add-post-modal__post');
const addPostFileInput = document.getElementById('add-post-file');
const addPostModalCloseBtn = addPostModal.querySelector('.modal__close-btn');
const addPostShareBtn = document.getElementById('add-post-share');
const addPostModalTextarea = addPostModal.querySelector('.add-post-modal__textarea');
const postsGallery = document.querySelector('.posts__gallery');

// 프로필 관련 DOM 요소 선택
const profileImg = document.getElementById('profile-img');
const profileId = document.getElementById('profile-id');
const profilePosts = document.getElementById('profile-posts');
const profileFollwers = document.getElementById('profile-followers');
const profileFollowing = document.getElementById('profile-following');
const profileName = document.getElementById('profile-name');
const profileDescription = document.getElementById('profile-description');
const profileLink = document.getElementById('profile-link');

// 프로필 수정 관련 DOM 요소 선택
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

// 다이얼로그를 여는 함수
const openAddPostModal = () => {
    const addPostModal = document.querySelector('.add-post-modal');

    if (addPostModal.open) addPostModal.close();
    
    addPostModal.showModal();
}

const openUpdateProfileModal = () => {
    const updateProfileModal = document.querySelector('.update-profile-modal');
    
    if (updateProfileModal.open) {
        updateProfileModal.close();
    }

    updateProfileModal.showModal();
}

// 이벤트 초기화 함수
const initEvents = () => {
    // 게시물 관련 이벤트
    addPost.addEventListener('click', openAddPostModal);
    addPostModalCloseBtn.addEventListener('click', () => addModalShareToFileMode());
    addPostFileInput.addEventListener('change', handleFileInputChangePost); // -> 기존 프로필 데이터 변경됨

    // 프로필 수정 관련 이벤트
    updateProfileBtn.addEventListener('click', openUpdateProfileModal);
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
    updatePostsUI();
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

// 프로필 업데이트 함수
const updateProfile = (newProfile) => {
    localStorage.setItem('profile', JSON.stringify(newProfile));
    updateProfileUI();
}

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

// 게시물 UI 업데이트 함수
const updatePostsUI = () => {
    const openedDialogPostId = whichDialogOpen();
    const posts = JSON.parse(localStorage.getItem('posts')) || [];

    if (!posts.length) {
        postsGallery.classList.add('posts__gallery--no-posts');
        postsGallery.innerHTML = `<div class="posts__no-posts">
                                    <div class="posts__circle">
                                        <img src="assets/camera_icon.svg" alt="camera_icon" />
                                    </div>
                                    <h3>게시물 없음</h3>
                                </div>`;
        return;
    }

    postsGallery.classList.remove('posts__gallery--no-posts');
    const innerHTML = posts.reduce((acc, post) => {
        return (
            acc +
            `<div class="post" id="post-${post.id}">
                <div class="post__info">
                    <div class="post__info-item">
                        <img src="assets/heart_icon.svg" alt="heart_icon" />
                        ${post.likes}
                    </div>
                    <div class="post__info-item">
                        <img src="assets/comment_icon.svg" alt="comment_icon" />
                        ${post.comments}
                    </div>
                </div>
                <img src="${post.image}" alt="post-${post.id}" />
                <dialog class="post-modal modal post-modal--view-mode">
                    <form method="dialog">
                        <img class="modal__image" src="${post.image}" alt="post-${post.id}" />
                        <article class="post-modal__article">
                            ${post.text}
                        </article>
                        <div class="post-modal__update">
                            <textarea class="post-modal__textarea" placeholder="여기에 수정할 내용을 작성하세요.">${post.text}</textarea>
                            <div class="post-modal__update-btns">
                                <button class="post-modal__update-submit-btn">수정</button>
                                <button class="post-modal__update-cancel-btn">취소</button>
                            </div>
                        </div>
                        <div class="post-modal__btns">
                            <button class="post-modal__btn post-modal__update-btn">
                                <img src="assets/edit_icon.svg" alt="edit_icon" />
                            </button>
                            <button class="post-modal__btn post-modal__delete-btn">
                                <img src="assets/trash_icon.svg" alt="trash_icon" />
                            </button>
                        </div>
                        <button class="modal__close-btn">
                            <img src="assets/close_icon.svg" alt="close_icon" />
                        </button>
                    </form>
                </dialog>
            </div>`
        );
    }, '');

    postsGallery.innerHTML = innerHTML;

    posts.forEach(({ id, text }) => {
        const post = document.getElementById(`post-${id}`);
        if (!post) return;

        const postModal = post.querySelector('.post-modal');
        if (!postModal) return;
        if (openedDialogPostId === `post-${id}`) postModal.showModal();

        post.addEventListener('click', () => {
            if (!postModal.open) postModal.showModal();
        });

        const closeBtn = postModal.querySelector('.modal__close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => postModalUpdateToViewMode(postModal, text));
        }

        const deleteBtn = post.querySelector('.post-modal__delete-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', ()=> confirm('정말로 삭제하시겠습니까?') && deletePost(id))
        }

        const updateBtn = post.querySelector('.post-modal__update-btn');
        if (updateBtn) {
            updateBtn.addEventListener('click', (e) => {
                e.preventDefault();
                postModalViewToUpdateMode(postModal);
            })
        }

        const updateSubmitBtn = postModal.querySelector('.post-modal__update-submit-btn');
        if (updateBtn) {
            updateSubmitBtn.addEventListener('click', (e) => {
                e.preventDefault();
                updatePost(id, postModal.querySelector('.post-modal__textarea').value);
            })
        }

        const updateCancelBtn = postModal.querySelector('.post-modal__updtae-cancel-btn');
        if (updateCancelBtn) {
            updateCancelBtn.addEventListener('click', (e) => {
                e.preventDefault();
                postModalUpdateToViewMode(postModal, text);
            })
        }
    });
};

// 게시물 모달을 업데이트 모드로 전환하는 함수
const postModalViewToUpdateMode = (postModal) => {
    postModal.classList.remove('post-modal--view-mode');
    postModal.classList.add('post-modal--update-mode');
}

// 게시물 모달을 뷰 모드로 전환하는 함수
const postModalUpdateToViewMode = (postModal, originText) => {
    postModal.querySelector('.post-modal__textarea').value = originText;
    postModal.classList.add('post-modal--view-mode');
    postModal.classList.remove('post-modal--update-mode');
}

// 게시물 생성 함수
const createPost = (image, text) => {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const newPost = {
        id: posts.length ? posts[posts.length - 1].id + 1 : 1,
        likes: 0,
        comments: 0,
        image,
        text,
    };

    posts.push(newPost);
    localStorage.setItem('posts', JSON.stringify(posts));
    updateUI();
}

// 게시물 업데이트 함수
const updatePost = (id, text) => {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];

    if (!posts.length) return;

    localStorage.setItem('posts', JSON.stringify(
        posts.map(({ id: postId, text: postText, ...rest }) =>
            id === postId ? { id: postId, text, ...rest } : { id: postId, text: postText, ...rest }
        )
    ));

    updatePostsUI();
}

// 게시물 삭제 함수
const deletePost = (id) => {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];

    if (!posts.length) return;

    localStorage.setItem('posts', JSON.stringify(posts.filter(({ id: postId }) => id !== postId)));

    updateUI();
}

// 모달을 파일 모드로 전환하는 함수
const addModalShareToFileMode = () => {
    addPostModal.classList.remove('add-post-modal--share-mode');
    addPostModal.classList.add('add-post-modal--file-mode');
}

// 모달을 공유 모드로 전환하는 함수
const addModalFileToShareMode = () => {
    addPostModal.classList.remove('add-post-modal--file-mode');
    addPostModal.classList.add('add-post-modal--share-mode');
}

// 게시물 파일 입력 변경 처리 함수
function handleFileInputChangePost() {
    const fr = new FileReader();

    fr.readAsDataURL(this.files[0]);

    const loadEvent = fr.addEventListener('load', function () {
        addModalFileToShareMode();

        addPostShareBtn.addEventListener('click', () => {
            createPost(fr.result, addPostModalTextarea.value);
            addPostModalTextarea.value = '';
            addModalShareToFileMode();
        }, { once: true });

        addPostModalPost.querySelector('.modal__image').setAttribute('src', fr.result);
    });

    fr.removeEventListener('load', loadEvent);
}
