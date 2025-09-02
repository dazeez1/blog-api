// Configuration with fallback
const API_BASE_URL = (window.BlogHubConfig && window.BlogHubConfig.API_BASE_URL) || 'https://blog-api-es4r.onrender.com/api';

// Fallback configuration if config.js fails to load
if (!window.BlogHubConfig) {
  window.BlogHubConfig = {
    API_BASE_URL: API_BASE_URL
  };
}

let currentUser = null;
let currentPostId = null;
let currentPage = 1;
let postsPerPage = 6;

// DOM Elements
const authBtn = document.getElementById('authBtn');
const authModal = document.getElementById('authModal');
const postModal = document.getElementById('postModal');
const postDetailModal = document.getElementById('postDetailModal');
const createPostBtn = document.getElementById('createPostBtn');
const loadingSpinner = document.getElementById('loadingSpinner');

// Initialize the application
document.addEventListener('DOMContentLoaded', function () {
  initializeApp();
  setupEventListeners();
  checkAuthStatus();
});

function initializeApp() {
  // Check if user is already logged in
  const token = localStorage.getItem('token');
  if (token) {
    currentUser = JSON.parse(localStorage.getItem('user'));
    updateUIForAuthenticatedUser();
  }

  // Load initial posts
  loadPosts();
}

function setupEventListeners() {
  // Navigation
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const section = e.target.dataset.section;
      showSection(section);
    });
  });

  // Auth button
  authBtn.addEventListener('click', () => {
    if (currentUser) {
      logout();
    } else {
      showAuthModal();
    }
  });

  // Create post button
  createPostBtn.addEventListener('click', () => {
    showPostModal();
  });

  // Modal close buttons
  document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', e => {
      const modal = e.target.closest('.modal');
      modal.style.display = 'none';
    });
  });

  // Close modals when clicking outside
  window.addEventListener('click', e => {
    if (e.target.classList.contains('modal')) {
      e.target.style.display = 'none';
    }
  });

  // Auth tabs
  document.querySelectorAll('.tab-btn').forEach(tab => {
    tab.addEventListener('click', () => {
      switchAuthTab(tab.dataset.tab);
    });
  });

  // Auth forms
  document.getElementById('loginForm').addEventListener('submit', handleLogin);
  document
    .getElementById('signupForm')
    .addEventListener('submit', handleSignup);
  document
    .getElementById('postForm')
    .addEventListener('submit', handlePostSubmit);
}

// Navigation
function showSection(sectionName) {
  // Hide all sections
  document.querySelectorAll('.section').forEach(section => {
    section.classList.remove('active');
  });

  // Show target section
  document.getElementById(sectionName).classList.add('active');

  // Update navigation
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });
  document
    .querySelector(`[data-section="${sectionName}"]`)
    .classList.add('active');

  // Load section-specific content
  if (sectionName === 'posts') {
    loadPosts();
  } else if (sectionName === 'profile') {
    if (currentUser) {
      loadProfile();
    } else {
      showAuthModal();
    }
  }
}

// Authentication
function showAuthModal() {
  authModal.style.display = 'block';
  switchAuthTab('login');
}

function switchAuthTab(tab) {
  // Update tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

  // Update forms
  document.querySelectorAll('.auth-form').forEach(form => {
    form.classList.remove('active');
  });
  document.getElementById(`${tab}Form`).classList.add('active');
}

async function handleLogin(e) {
  e.preventDefault();
  showLoading();

  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      currentUser = data.data.user;

      updateUIForAuthenticatedUser();
      authModal.style.display = 'none';
      showNotification('Login successful!', 'success');

      // Clear form
      document.getElementById('loginForm').reset();
    } else {
      showNotification(data.message || 'Login failed', 'error');
    }
  } catch (error) {
    showNotification('An error occurred. Please try again.', 'error');
  } finally {
    hideLoading();
  }
}

async function handleSignup(e) {
  e.preventDefault();
  showLoading();

  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (data.success) {
      showNotification(
        'Account created successfully! Please login.',
        'success'
      );
      switchAuthTab('login');
      document.getElementById('signupForm').reset();
    } else {
      showNotification(data.message || 'Signup failed', 'error');
    }
  } catch (error) {
    showNotification('An error occurred. Please try again.', 'error');
  } finally {
    hideLoading();
  }
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  currentUser = null;
  updateUIForUnauthenticatedUser();
  showNotification('Logged out successfully', 'success');
  showSection('home');
}

function checkAuthStatus() {
  const token = localStorage.getItem('token');
  if (token) {
    currentUser = JSON.parse(localStorage.getItem('user'));
    updateUIForAuthenticatedUser();
  }
}

function updateUIForAuthenticatedUser() {
  authBtn.textContent = 'Logout';
  createPostBtn.style.display = 'inline-flex';
}

function updateUIForUnauthenticatedUser() {
  authBtn.textContent = 'Login';
  createPostBtn.style.display = 'none';
}

// Posts
async function loadPosts(page = 1) {
  showLoading();
  currentPage = page;

  try {
    const response = await fetch(
      `${API_BASE_URL}/posts?page=${page}&limit=${postsPerPage}`
    );
    const data = await response.json();

    if (data.success) {
      displayPosts(data.data.posts);
      displayPagination(data.data.pagination);
    } else {
      showNotification('Failed to load posts', 'error');
    }
  } catch (error) {
    showNotification('An error occurred while loading posts', 'error');
  } finally {
    hideLoading();
  }
}

function displayPosts(posts) {
  const postsGrid = document.getElementById('postsGrid');

  if (posts.length === 0) {
    postsGrid.innerHTML =
      '<div class="no-posts"><p>No posts found. Be the first to create one!</p></div>';
    return;
  }

  postsGrid.innerHTML = posts
    .map(
      post => `
        <div class="post-card" onclick="showPostDetail('${post._id}')">
            <div class="post-header">
                <h3 class="post-title">${post.title}</h3>
                <div class="post-meta">
                    <div class="post-author">
                        <i class="fas fa-user"></i>
                        <span>${post.author.name}</span>
                    </div>
                    <span>${formatDate(post.createdAt)}</span>
                </div>
            </div>
            <div class="post-content">${post.content}</div>
            ${
              post.tags && post.tags.length > 0
                ? `
                <div class="post-tags">
                    ${post.tags.map(tag => `<span class="post-tag">${tag}</span>`).join('')}
                </div>
            `
                : ''
            }
        </div>
    `
    )
    .join('');
}

function displayPagination(pagination) {
  const paginationContainer = document.getElementById('pagination');
  const { currentPage, totalPages, hasNextPage, hasPrevPage } = pagination;

  let paginationHTML = '';

  if (hasPrevPage) {
    paginationHTML += `<button onclick="loadPosts(${currentPage - 1})">Previous</button>`;
  }

  for (let i = 1; i <= totalPages; i++) {
    if (i === currentPage) {
      paginationHTML += `<button class="active">${i}</button>`;
    } else {
      paginationHTML += `<button onclick="loadPosts(${i})">${i}</button>`;
    }
  }

  if (hasNextPage) {
    paginationHTML += `<button onclick="loadPosts(${currentPage + 1})">Next</button>`;
  }

  paginationContainer.innerHTML = paginationHTML;
}

// Post Detail Functions
async function showPostDetail(postId) {
  currentPostId = postId; // Set the current post ID for comments
  showLoading();
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}`);
    const data = await response.json();

    if (data.success) {
      displayPostDetail(data.data);
      loadComments(postId);
      postDetailModal.style.display = 'block';
    } else {
      showNotification('Failed to load post details', 'error');
    }
  } catch (error) {
    console.error('Post detail loading error:', error);
    showNotification('Failed to load post details', 'error');
  } finally {
    hideLoading();
  }
}

function displayPostDetail(post) {
  const postDetailContent = document.getElementById('postDetailContent');

  postDetailContent.innerHTML = `
        <div class="post-detail">
            <h2>${post.title}</h2>
            <div class="post-meta">
                <div class="post-author">
                    <i class="fas fa-user"></i>
                    <span>${post.author.name}</span>
                </div>
                <span>${formatDate(post.createdAt)}</span>
            </div>
            <div class="post-content">${post.content}</div>
            ${
              post.tags && post.tags.length > 0
                ? `
                <div class="post-tags">
                    ${post.tags.map(tag => `<span class="post-tag">${tag}</span>`).join('')}
                </div>
            `
                : ''
            }
            ${
              currentUser && post.author._id === currentUser._id
                ? `
                <div class="post-actions">
                    <button class="btn btn-primary" onclick="showPostModal('${post._id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger" onclick="deletePost('${post._id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            `
                : ''
            }
        </div>
        <div class="comments-section">
            <h3>Comments</h3>
            ${
              currentUser
                ? `
                <form class="comment-form" onsubmit="handleCommentSubmit(event)">
                    <textarea placeholder="Write a comment..." required></textarea>
                    <button type="submit" class="btn btn-primary">Post Comment</button>
                </form>
            `
                : ''
            }
            <div id="commentsContainer">
                <!-- Comments will be loaded here -->
            </div>
        </div>
    `;
}

// Post Management
function showPostModal(postId = null) {
  currentPostId = postId;
  const modalTitle = document.getElementById('postModalTitle');
  const postForm = document.getElementById('postForm');

  if (postId) {
    modalTitle.textContent = 'Edit Post';
    // Load post data for editing
    loadPostForEditing(postId);
  } else {
    modalTitle.textContent = 'Create New Post';
    postForm.reset();
  }

  postModal.style.display = 'block';
}

function closePostModal() {
  postModal.style.display = 'none';
  currentPostId = null;
}

async function loadPostForEditing(postId) {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}`);
    const data = await response.json();

    if (data.success) {
      const post = data.data;
      document.getElementById('postTitle').value = post.title;
      document.getElementById('postContent').value = post.content;
      document.getElementById('postTags').value = post.tags
        ? post.tags.join(', ')
        : '';
    }
  } catch (error) {
    showNotification('Failed to load post for editing', 'error');
  }
}

async function handlePostSubmit(e) {
  e.preventDefault();
  showLoading();

  const title = document.getElementById('postTitle').value;
  const content = document.getElementById('postContent').value;
  const tags = document
    .getElementById('postTags')
    .value.split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0);

  const postData = { title, content, tags };
  const method = currentPostId ? 'PUT' : 'POST';
  const url = currentPostId
    ? `${API_BASE_URL}/posts/${currentPostId}`
    : `${API_BASE_URL}/posts`;

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(postData),
    });

    const data = await response.json();

    if (data.success) {
      showNotification(
        currentPostId
          ? 'Post updated successfully!'
          : 'Post created successfully!',
        'success'
      );
      closePostModal();
      loadPosts(currentPage);
    } else {
      showNotification(data.message || 'Operation failed', 'error');
    }
  } catch (error) {
    showNotification('An error occurred. Please try again.', 'error');
  } finally {
    hideLoading();
  }
}

async function deletePost(postId) {
  if (!confirm('Are you sure you want to delete this post?')) {
    return;
  }

  showLoading();

  try {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const data = await response.json();

    if (data.success) {
      showNotification('Post deleted successfully!', 'success');
      postDetailModal.style.display = 'none';
      loadPosts(currentPage);
    } else {
      showNotification(data.message || 'Failed to delete post', 'error');
    }
  } catch (error) {
    showNotification('An error occurred. Please try again.', 'error');
  } finally {
    hideLoading();
  }
}

// Comments
async function loadComments(postId) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/comments/posts/${postId}/comments`
    );
    const data = await response.json();

    if (data.success) {
      displayComments(data.data.comments);
    }
  } catch (error) {
    console.error('Failed to load comments:', error);
  }
}

function displayComments(comments) {
  const commentsContainer = document.getElementById('commentsContainer');

  if (comments.length === 0) {
    commentsContainer.innerHTML =
      '<p>No comments yet. Be the first to comment!</p>';
    return;
  }

  commentsContainer.innerHTML = comments
    .map(
      comment => `
        <div class="comment">
            <div class="comment-header">
                <span class="comment-author">${comment.author.name}</span>
                <span class="comment-date">${formatDate(comment.createdAt)}</span>
            </div>
            <div class="comment-content">${comment.content}</div>
            ${
              currentUser && comment.author._id === currentUser._id
                ? `
                <div class="comment-actions">
                    <button class="btn btn-secondary" onclick="editComment('${comment._id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger" onclick="deleteComment('${comment._id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            `
                : ''
            }
        </div>
    `
    )
    .join('');
}

async function handleCommentSubmit(e) {
  e.preventDefault();

  const textarea = e.target.querySelector('textarea');
  const content = textarea.value.trim();

  if (!content) return;

  try {
    const response = await fetch(
      `${API_BASE_URL}/comments/posts/${currentPostId}/comments`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ content }),
      }
    );

    const data = await response.json();

    if (data.success) {
      textarea.value = '';
      loadComments(currentPostId);
      showNotification('Comment posted successfully!', 'success');
    } else {
      showNotification(data.message || 'Failed to post comment', 'error');
    }
  } catch (error) {
    showNotification('An error occurred. Please try again.', 'error');
  }
}

async function editComment(commentId) {
  const newContent = prompt('Edit your comment:');
  if (!newContent || newContent.trim() === '') return;

  try {
    const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ content: newContent.trim() }),
    });

    const data = await response.json();

    if (data.success) {
      loadComments(currentPostId);
      showNotification('Comment updated successfully!', 'success');
    } else {
      showNotification(data.message || 'Failed to update comment', 'error');
    }
  } catch (error) {
    showNotification('An error occurred. Please try again.', 'error');
  }
}

async function deleteComment(commentId) {
  if (!confirm('Are you sure you want to delete this comment?')) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const data = await response.json();

    if (data.success) {
      loadComments(currentPostId);
      showNotification('Comment deleted successfully!', 'success');
    } else {
      showNotification(data.message || 'Failed to delete comment', 'error');
    }
  } catch (error) {
    showNotification('An error occurred. Please try again.', 'error');
  }
}

// Profile
async function loadProfile() {
  if (!currentUser) return;

  showLoading();

  try {
    const [profileResponse, postsResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
      fetch(`${API_BASE_URL}/posts/my-posts`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
    ]);

    const profileData = await profileResponse.json();
    const postsData = await postsResponse.json();

    if (profileData.success) {
      displayProfile(profileData.data);
    }

    if (postsData.success) {
      displayMyPosts(postsData.data.posts);
    }
  } catch (error) {
    showNotification('Failed to load profile', 'error');
  } finally {
    hideLoading();
  }
}

function displayProfile(user) {
  const profileInfo = document.getElementById('profileInfo');

  profileInfo.innerHTML = `
        <h3>Profile Information</h3>
        <div class="profile-field">
            <label>Name</label>
            <input type="text" id="profileName" value="${user.name}" />
        </div>
        <div class="profile-field">
            <label>Email</label>
            <input type="email" id="profileEmail" value="${user.email}" />
        </div>
        <button class="btn btn-primary" onclick="updateProfile()">
            <i class="fas fa-save"></i> Update Profile
        </button>
    `;
}

function displayMyPosts(posts) {
  const myPosts = document.getElementById('myPosts');

  if (posts.length === 0) {
    myPosts.innerHTML =
      "<h3>My Posts</h3><p>You haven't created any posts yet.</p>";
    return;
  }

  myPosts.innerHTML = `
        <h3>My Posts</h3>
        <div class="posts-grid">
            ${posts
              .map(
                post => `
                <div class="post-card" onclick="showPostDetail('${post._id}')">
                    <div class="post-header">
                        <h3 class="post-title">${post.title}</h3>
                        <div class="post-meta">
                            <span>${formatDate(post.createdAt)}</span>
                        </div>
                    </div>
                    <div class="post-content">${post.content}</div>
                    ${
                      post.tags && post.tags.length > 0
                        ? `
                        <div class="post-tags">
                            ${post.tags.map(tag => `<span class="post-tag">${tag}</span>`).join('')}
                        </div>
                    `
                        : ''
                    }
                </div>
            `
              )
              .join('')}
        </div>
    `;
}

async function updateProfile() {
  const name = document.getElementById('profileName').value;
  const email = document.getElementById('profileEmail').value;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ name, email }),
    });

    const data = await response.json();

    if (data.success) {
      showNotification('Profile updated successfully!', 'success');
      currentUser = data.data;
      localStorage.setItem('user', JSON.stringify(data.data));
    } else {
      showNotification(data.message || 'Failed to update profile', 'error');
    }
  } catch (error) {
    showNotification('An error occurred. Please try again.', 'error');
  }
}

// Utility Functions
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function showLoading() {
  loadingSpinner.style.display = 'flex';
}

function hideLoading() {
  loadingSpinner.style.display = 'none';
}

function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  // Add styles
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 4000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;

  // Set background color based on type
  switch (type) {
    case 'success':
      notification.style.backgroundColor = '#10b981';
      break;
    case 'error':
      notification.style.backgroundColor = '#ef4444';
      break;
    case 'warning':
      notification.style.backgroundColor = '#f59e0b';
      break;
    default:
      notification.style.backgroundColor = '#3b82f6';
  }

  // Add to page
  document.body.appendChild(notification);

  // Remove after 5 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 5000);
}
// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

