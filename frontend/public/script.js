// BlogHub Frontend - Complete Working Version
console.log('Script.js loaded');

let currentUser = null;
let currentPostId = null;
let currentPage = 1;
const postsPerPage = 6;

// API Configuration
const API_BASE_URL = (window.BlogHubConfig && window.BlogHubConfig.API_BASE_URL) || 'https://blog-api-es4r.onrender.com/api';

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, setting up event listeners...');
  setupEventListeners();
  initializeApp();
});

// Set up all event listeners
function setupEventListeners() {
  console.log('Setting up event listeners...');
  
  // Auth button
  const authBtn = document.getElementById('authBtn');
  if (authBtn) {
    authBtn.addEventListener('click', function() {
      if (currentUser) {
        logout();
      } else {
        showAuthModal();
      }
    });
    console.log('Auth button listener set up');
  }

  // Create post button
  const createPostBtn = document.getElementById('createPostBtn');
  if (createPostBtn) {
    createPostBtn.addEventListener('click', function() {
      showPostModal();
    });
    console.log('Create post button listener set up');
  }

  // Post form
  const postForm = document.getElementById('postForm');
  if (postForm) {
    postForm.addEventListener('submit', handlePostSubmit);
    console.log('Post form listener set up');
  }

  // Login form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
    console.log('Login form listener set up');
  }

  // Signup form
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', handleSignup);
    console.log('Signup form listener set up');
  }

  // Modal close buttons
  document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', function() {
      const modal = this.closest('.modal');
      if (modal) modal.style.display = 'none';
    });
  });

  // Auth tabs
  document.querySelectorAll('.tab-btn').forEach(tab => {
    tab.addEventListener('click', function() {
      const tabName = this.getAttribute('data-tab');
      switchAuthTab(tabName);
    });
  });

  // Navigation links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const section = this.getAttribute('data-section');
      showSection(section);
    });
  });

  console.log('All event listeners set up');
}

// Initialize the application
function initializeApp() {
  console.log('Initializing app...');
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  if (token && user) {
    currentUser = JSON.parse(user);
    updateUIForAuthenticatedUser();
    loadPosts();
    loadProfile();
  } else {
    updateUIForUnauthenticatedUser();
  }
}

// UI Updates
function updateUIForAuthenticatedUser() {
  const authBtn = document.getElementById('authBtn');
  const createPostBtn = document.getElementById('createPostBtn');
  
  if (authBtn) authBtn.textContent = 'Logout';
  if (createPostBtn) createPostBtn.style.display = 'inline-flex';
}

function updateUIForUnauthenticatedUser() {
  const authBtn = document.getElementById('authBtn');
  const createPostBtn = document.getElementById('createPostBtn');
  
  if (authBtn) authBtn.textContent = 'Login';
  if (createPostBtn) createPostBtn.style.display = 'none';
}

// Authentication
function showAuthModal() {
  const authModal = document.getElementById('authModal');
  if (authModal) {
    authModal.style.display = 'block';
    switchAuthTab('login');
  }
}

function switchAuthTab(tabName) {
  // Update tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

  // Update forms
  document.querySelectorAll('.auth-form').forEach(form => {
    form.classList.remove('active');
  });
  document.getElementById(`${tabName}Form`).classList.add('active');
}

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (data.success) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      currentUser = data.user;
      updateUIForAuthenticatedUser();
      loadPosts();
      loadProfile();
      document.getElementById('authModal').style.display = 'none';
      alert('Login successful!');
    } else {
      alert(data.message || 'Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('Login failed. Please try again.');
  }
}

async function handleSignup(e) {
  e.preventDefault();
  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();
    if (data.success) {
      alert('Account created successfully! Please login.');
      switchAuthTab('login');
    } else {
      alert(data.message || 'Signup failed');
    }
  } catch (error) {
    console.error('Signup error:', error);
    alert('Signup failed. Please try again.');
  }
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  currentUser = null;
  updateUIForUnauthenticatedUser();
  showSection('home');
}

// Posts CRUD
async function loadPosts(page = 1) {
  currentPage = page;
  try {
    const response = await fetch(`${API_BASE_URL}/posts?page=${page}&limit=${postsPerPage}`);
    const data = await response.json();

    if (data.success) {
      const posts = data.data?.items || data.data?.posts || data.items || data.posts || data.data || [];
      displayPosts(posts);
      displayPagination(data.data?.pagination || data.pagination || {});
    }
  } catch (error) {
    console.error('Failed to load posts:', error);
  }
}

function displayPosts(posts) {
  const postsGrid = document.getElementById('postsGrid');
  if (!postsGrid) return;

  if (!posts || posts.length === 0) {
    postsGrid.innerHTML = '<p>No posts found.</p>';
    return;
  }

  postsGrid.innerHTML = posts.map(post => `
    <div class="post-card" onclick="showPostDetail('${post._id}')">
      <h3>${post.title || 'Untitled'}</h3>
      <p>${post.content || 'No content'}</p>
      <div class="post-meta">
        <span>By: ${post.author?.name || post.author?.email || 'Unknown'}</span>
        <span>${formatDate(post.createdAt)}</span>
      </div>
      ${post.tags && post.tags.length > 0 ? 
        `<div class="tags">${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>` : 
        ''
      }
    </div>
  `).join('');
}

function displayPagination(pagination) {
  const paginationContainer = document.getElementById('pagination');
  if (!paginationContainer) return;

  const { currentPage, totalPages, hasNextPage, hasPrevPage } = pagination;
  let html = '';

  if (hasPrevPage) html += `<button onclick="loadPosts(${currentPage - 1})">Previous</button>`;
  for (let i = 1; i <= totalPages; i++) {
    html += `<button ${i === currentPage ? 'class="active"' : ''} onclick="loadPosts(${i})">${i}</button>`;
  }
  if (hasNextPage) html += `<button onclick="loadPosts(${currentPage + 1})">Next</button>`;

  paginationContainer.innerHTML = html;
}

// Post Detail and Actions
async function showPostDetail(postId) {
  currentPostId = postId;
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}`);
    const data = await response.json();

    if (data.success) {
      const post = data.data || data.post || data;
      displayPostDetail(post);
      loadComments(postId);
      document.getElementById('postDetailModal').style.display = 'block';
    }
  } catch (error) {
    console.error('Failed to load post:', error);
  }
}

function displayPostDetail(post) {
  const content = document.getElementById('postDetailContent');
  if (!content) return;

  const isAuthor = currentUser && post.author?._id === currentUser._id;
  
  content.innerHTML = `
    <h2>${post.title || 'Untitled'}</h2>
    <p>${post.content || 'No content'}</p>
    <div class="post-meta">
      <span>By: ${post.author?.name || post.author?.email || 'Unknown'}</span>
      <span>${formatDate(post.createdAt)}</span>
    </div>
    ${post.tags && post.tags.length > 0 ? 
      `<div class="tags">${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>` : 
      ''
    }
    ${isAuthor ? `
      <div class="post-actions">
        <button onclick="showPostModal('${post._id}')" class="btn btn-primary">Edit</button>
        <button onclick="deletePost('${post._id}')" class="btn btn-danger">Delete</button>
      </div>
    ` : ''}
    <div class="comments-section">
      <h3>Comments</h3>
      ${currentUser ? `
        <form onsubmit="handleCommentSubmit(event)">
          <textarea placeholder="Write a comment..." required></textarea>
          <button type="submit">Post Comment</button>
        </form>
      ` : ''}
      <div id="commentsContainer"></div>
    </div>
  `;
}

// Post Management
function showPostModal(postId = null) {
  console.log('showPostModal called with postId:', postId);
  currentPostId = postId;
  const modal = document.getElementById('postModal');
  const title = document.getElementById('postModalTitle');
  const form = document.getElementById('postForm');

  if (postId) {
    title.textContent = 'Edit Post';
    loadPostForEditing(postId);
  } else {
    title.textContent = 'Create Post';
    form.reset();
  }

  modal.style.display = 'block';
}

function closePostModal() {
  document.getElementById('postModal').style.display = 'none';
  currentPostId = null;
}

async function loadPostForEditing(postId) {
  console.log('loadPostForEditing called with postId:', postId);
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}`);
    const data = await response.json();
    console.log('Post data for editing:', data);

    if (data.success) {
      const post = data.data || data.post || data;
      document.getElementById('postTitle').value = post.title || '';
      document.getElementById('postContent').value = post.content || '';
      document.getElementById('postTags').value = post.tags ? post.tags.join(', ') : '';
      console.log('Post form populated with:', { title: post.title, content: post.content, tags: post.tags });
    }
  } catch (error) {
    console.error('Failed to load post for editing:', error);
  }
}

async function handlePostSubmit(e) {
  e.preventDefault();
  const title = document.getElementById('postTitle').value.trim();
  const content = document.getElementById('postContent').value.trim();
  const tagsInput = document.getElementById('postTags').value;

  if (!title || !content) {
    alert('Title and content are required');
    return;
  }

  const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
  const postData = { title, content, tags };

  try {
    const method = currentPostId ? 'PUT' : 'POST';
    const url = currentPostId ? `${API_BASE_URL}/posts/${currentPostId}` : `${API_BASE_URL}/posts`;

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
      alert(currentPostId ? 'Post updated!' : 'Post created!');
      closePostModal();
      loadPosts(currentPage);
    } else {
      alert(data.message || 'Operation failed');
    }
  } catch (error) {
    console.error('Post operation failed:', error);
    alert('Operation failed. Please try again.');
  }
}

async function deletePost(postId) {
  if (!confirm('Delete this post?')) return;

  try {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });

    const data = await response.json();

    if (data.success) {
      alert('Post deleted!');
      document.getElementById('postDetailModal').style.display = 'none';
      loadPosts(currentPage);
    } else {
      alert(data.message || 'Delete failed');
    }
  } catch (error) {
    console.error('Delete failed:', error);
    alert('Delete failed. Please try again.');
  }
}

// Comments
async function loadComments(postId) {
  try {
    const response = await fetch(`${API_BASE_URL}/comments/posts/${postId}/comments`);
    const data = await response.json();
    
    console.log('Comments API response:', data);

    if (data.success) {
      // Handle different possible response structures
      let comments = [];
      if (Array.isArray(data.data)) {
        comments = data.data;
      } else if (Array.isArray(data.data?.comments)) {
        comments = data.data.comments;
      } else if (Array.isArray(data.comments)) {
        comments = data.comments;
      } else if (Array.isArray(data.data?.items)) {
        comments = data.data.items;
      } else if (Array.isArray(data.items)) {
        comments = data.items;
      } else {
        console.warn('Unexpected comments response structure:', data);
        comments = [];
      }
      
      console.log('Extracted comments:', comments);
      displayComments(comments);
    } else {
      console.warn('Comments API returned success: false:', data);
      displayComments([]);
    }
  } catch (error) {
    console.error('Failed to load comments:', error);
    displayComments([]);
  }
}

function displayComments(comments) {
  const container = document.getElementById('commentsContainer');
  if (!container) {
    console.warn('Comments container not found');
    return;
  }

  // Ensure comments is an array
  if (!Array.isArray(comments)) {
    console.warn('Comments is not an array:', comments);
    comments = [];
  }

  if (comments.length === 0) {
    container.innerHTML = '<p>No comments yet.</p>';
    return;
  }

  try {
    container.innerHTML = comments.map(comment => {
      // Ensure comment has required properties
      if (!comment || typeof comment !== 'object') {
        console.warn('Invalid comment object:', comment);
        return '';
      }
      
      return `
        <div class="comment">
          <p>${comment.content || 'No content'}</p>
          <div class="comment-meta">
            <span>By: ${comment.author?.name || comment.author?.email || 'Unknown'}</span>
            <span>${formatDate(comment.createdAt)}</span>
            ${currentUser && comment.author?._id === currentUser._id ? `
              <button onclick="editComment('${comment._id}')">Edit</button>
              <button onclick="deleteComment('${comment._id}')">Delete</button>
            ` : ''}
          </div>
        </div>
      `;
    }).filter(html => html !== '').join('');
  } catch (error) {
    console.error('Error rendering comments:', error);
    container.innerHTML = '<p>Error loading comments.</p>';
  }
}

async function handleCommentSubmit(e) {
  e.preventDefault();
  console.log('handleCommentSubmit called');
  const textarea = e.target.querySelector('textarea');
  const content = textarea.value.trim();

  if (!content) return;

  console.log('Submitting comment:', { content, postId: currentPostId });

  try {
    const response = await fetch(`${API_BASE_URL}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ content, postId: currentPostId }),
    });

    const data = await response.json();
    console.log('Comment response:', data);

    if (data.success) {
      textarea.value = '';
      loadComments(currentPostId);
      alert('Comment posted successfully!');
    } else {
      alert(data.message || 'Comment failed');
    }
  } catch (error) {
    console.error('Comment failed:', error);
    alert('Comment failed. Please try again.');
  }
}

async function editComment(commentId) {
  const newContent = prompt('Edit comment:');
  if (!newContent) return;

  try {
    const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ content: newContent }),
    });

    const data = await response.json();

    if (data.success) {
      loadComments(currentPostId);
    } else {
      alert(data.message || 'Edit failed');
    }
  } catch (error) {
    console.error('Edit failed:', error);
    alert('Edit failed. Please try again.');
  }
}

async function deleteComment(commentId) {
  if (!confirm('Delete this comment?')) return;

  try {
    const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });

    const data = await response.json();

    if (data.success) {
      loadComments(currentPostId);
    } else {
      alert(data.message || 'Delete failed');
    }
  } catch (error) {
    console.error('Delete failed:', error);
    alert('Delete failed. Please try again.');
  }
}

// Profile
async function loadProfile() {
  if (!currentUser) return;

  try {
    displayProfile(currentUser);
    
    const response = await fetch(`${API_BASE_URL}/posts/my-posts`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });

    const data = await response.json();

    if (data.success) {
      const posts = data.data?.posts || data.data?.items || data.data || [];
      displayMyPosts(posts);
    }
  } catch (error) {
    console.error('Profile loading error:', error);
  }
}

function displayProfile(user) {
  const profileInfo = document.getElementById('profileInfo');
  if (!profileInfo) return;

  profileInfo.innerHTML = `
    <h3>Profile</h3>
    <p><strong>Name:</strong> ${user.name || 'Not provided'}</p>
    <p><strong>Email:</strong> ${user.email || 'Not provided'}</p>
  `;
}

function displayMyPosts(posts) {
  const myPosts = document.getElementById('myPosts');
  if (!myPosts) return;

  if (!posts || posts.length === 0) {
    myPosts.innerHTML = '<h3>My Posts</h3><p>No posts yet.</p>';
    return;
  }

  myPosts.innerHTML = `
    <h3>My Posts</h3>
    <div class="posts-grid">
      ${posts.map(post => `
        <div class="post-card" onclick="showPostDetail('${post._id}')">
          <h4>${post.title || 'Untitled'}</h4>
          <p>${post.content || 'No content'}</p>
          <span>${formatDate(post.createdAt)}</span>
        </div>
      `).join('')}
    </div>
  `;
}

// Utility Functions
function formatDate(dateString) {
  if (!dateString) return 'Unknown date';
  const date = new Date(dateString);
  return date.toLocaleDateString();
}

function showSection(sectionName) {
  const sections = ['home', 'posts', 'profile'];
  sections.forEach(section => {
    const element = document.getElementById(section);
    if (element) element.style.display = section === sectionName ? 'block' : 'none';
  });

  if (sectionName === 'home') loadPosts();
  if (sectionName === 'profile') loadProfile();
}

// Test function
function testClick() {
  alert('JavaScript is working!');
}
