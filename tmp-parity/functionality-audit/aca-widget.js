/**
 * AI Chat Assistant - frontend widget (Podium-inspired modern UI).
 * Vanilla JS, no dependencies.
 */
( function () {
	'use strict';

	if ( ! window.acaConfig ) {
		return;
	}

	var cfg = window.acaConfig;
	var STORAGE_KEY = 'aca_session_v1';
	var TEASER_DISMISSED_KEY = 'aca_teaser_dismissed_v1';
	var state = {
		open: false,
		busy: false,
		messages: [],
		formOpen: false,
		sessionId: null,
		teaserShown: false,
		welcomeShown: false,
	};

	function escapeHtml( str ) {
		var div = document.createElement( 'div' );
		div.textContent = str || '';
		return div.innerHTML;
	}

	function generateSessionId() {
		if ( window.crypto && typeof window.crypto.randomUUID === 'function' ) {
			return window.crypto.randomUUID();
		}
		return 'sess-' + Date.now() + '-' + Math.random().toString( 36 ).slice( 2, 10 );
	}

	function loadSession() {
		try {
			var raw = sessionStorage.getItem( STORAGE_KEY );
			if ( raw ) {
				var parsed = JSON.parse( raw );
				if ( parsed && Array.isArray( parsed.messages ) ) {
					// Only accept messages with proper role and content.
					state.messages = parsed.messages.filter( function ( m ) {
						return m && typeof m === 'object'
							&& ( 'user' === m.role || 'assistant' === m.role )
							&& 'string' === typeof m.content
							&& m.content.length > 0;
					} );
				}
				if ( parsed && parsed.sessionId ) {
					state.sessionId = parsed.sessionId;
				}
			}
		} catch ( e ) {
			// Stale or corrupt session data - clear it.
			try { sessionStorage.removeItem( STORAGE_KEY ); } catch ( err ) {}
		}
		if ( ! state.sessionId ) {
			state.sessionId = generateSessionId();
		}
	}

	function saveSession() {
		try {
			sessionStorage.setItem( STORAGE_KEY, JSON.stringify( {
				messages: state.messages,
				sessionId: state.sessionId,
			} ) );
		} catch ( e ) {}
	}

	function teaserDismissed() {
		try {
			return sessionStorage.getItem( TEASER_DISMISSED_KEY ) === '1';
		} catch ( e ) { return false; }
	}

	function dismissTeaser() {
		try { sessionStorage.setItem( TEASER_DISMISSED_KEY, '1' ); } catch ( e ) {}
		var teaser = document.getElementById( 'aca-teaser' );
		if ( teaser ) teaser.classList.remove( 'aca-teaser-visible' );
	}

	function avatarHtml( size, classes ) {
		classes = classes || '';
		if ( cfg.avatarUrl ) {
			return '<div class="aca-avatar ' + classes + '" style="width:' + size + 'px;height:' + size + 'px;">' +
				'<img src="' + escapeHtml( cfg.avatarUrl ) + '" alt="" />' +
				'</div>';
		}
		var initials = ( cfg.businessName || 'C' ).trim().split( /\s+/ ).slice( 0, 2 ).map( function ( w ) {
			return w.charAt( 0 ).toUpperCase();
		} ).join( '' );
		return '<div class="aca-avatar aca-avatar-fallback ' + classes + '" style="width:' + size + 'px;height:' + size + 'px;">' +
			'<span>' + escapeHtml( initials ) + '</span>' +
			'</div>';
	}

	function buildRoot() {
		var root = document.getElementById( 'aca-root' );
		if ( ! root ) {
			root = document.createElement( 'div' );
			root.id = 'aca-root';
			document.body.appendChild( root );
		}
		root.style.setProperty( '--aca-primary', cfg.primaryColor );
		root.setAttribute( 'data-position', cfg.position || 'bottom-right' );

		root.innerHTML =
			// Teaser bubble
			'<div class="aca-teaser" id="aca-teaser" role="button" tabindex="0" aria-label="Open chat">' +
				'<button type="button" class="aca-teaser-dismiss" id="aca-teaser-dismiss" aria-label="Dismiss">' +
					'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
				'</button>' +
				'<div class="aca-teaser-text">' + escapeHtml( cfg.teaserText || cfg.greeting ) + '</div>' +
			'</div>' +

			// Launcher button - launcherIconUrl takes precedence; falls back to avatar; then to default SVG.
			'<button type="button" class="aca-launcher" id="aca-launcher" aria-label="Open chat">' +
				( cfg.launcherIconUrl
					? '<img class="aca-launcher-avatar" src="' + escapeHtml( cfg.launcherIconUrl ) + '" alt="" />'
					: ( cfg.avatarUrl
						? '<img class="aca-launcher-avatar" src="' + escapeHtml( cfg.avatarUrl ) + '" alt="" />'
						: '<svg class="aca-icon-chat" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>'
					)
				) +
				'<svg class="aca-icon-close" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
				'<span class="aca-launcher-pulse"></span>' +
			'</button>' +

			// Main panel
			'<div class="aca-panel" id="aca-panel" role="dialog" aria-label="Chat with us">' +
				'<header class="aca-header">' +
					'<div class="aca-header-content">' +
						avatarHtml( 40, 'aca-header-avatar' ) +
						'<div class="aca-header-text">' +
							'<div class="aca-header-title">' + escapeHtml( cfg.businessName || cfg.widgetTitle ) + '</div>' +
							( cfg.subtitle
								? '<div class="aca-header-subtitle">' + escapeHtml( cfg.subtitle ) + '</div>'
								: '' ) +
						'</div>' +
					'</div>' +
					'<div class="aca-header-actions">' +
						'<button type="button" class="aca-header-menu-btn" id="aca-menu-btn" aria-label="Menu" aria-haspopup="true" aria-expanded="false">' +
							'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="5" r="0.5"/><circle cx="12" cy="12" r="0.5"/><circle cx="12" cy="19" r="0.5"/></svg>' +
						'</button>' +
						'<button type="button" class="aca-header-close" id="aca-close" aria-label="Close chat">' +
							'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
						'</button>' +
						'<div class="aca-header-menu" id="aca-menu" role="menu">' +
							'<button type="button" class="aca-menu-item" id="aca-menu-new" role="menuitem">' +
								'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>' +
								'<span>Start a new chat</span>' +
							'</button>' +
							'<button type="button" class="aca-menu-item aca-menu-item-danger" id="aca-menu-end" role="menuitem">' +
								'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
								'<span>End chat</span>' +
							'</button>' +
						'</div>' +
					'</div>' +
				'</header>' +
				'<div class="aca-messages" id="aca-messages" aria-live="polite"></div>' +
				'<form class="aca-input-row" id="aca-form">' +
					'<div class="aca-input-wrap">' +
						'<textarea id="aca-input" class="aca-input" rows="1" placeholder="Send a message..." aria-label="Message"></textarea>' +
						'<button type="submit" class="aca-send" id="aca-send" aria-label="Send" disabled>' +
							'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>' +
						'</button>' +
					'</div>' +
				'</form>' +
				'<div class="aca-footer">Powered by Kosick AI</div>' +
			'</div>';

		document.getElementById( 'aca-launcher' ).addEventListener( 'click', toggleOpen );
		document.getElementById( 'aca-close' ).addEventListener( 'click', toggleOpen );

		// Three-dot menu toggle
		var menuBtn = document.getElementById( 'aca-menu-btn' );
		var menu = document.getElementById( 'aca-menu' );
		menuBtn.addEventListener( 'click', function ( e ) {
			e.stopPropagation();
			var isOpen = menu.classList.toggle( 'aca-menu-open' );
			menuBtn.setAttribute( 'aria-expanded', isOpen ? 'true' : 'false' );
		} );
		// Close menu when clicking elsewhere
		document.addEventListener( 'click', function ( e ) {
			if ( ! menu.contains( e.target ) && e.target !== menuBtn ) {
				menu.classList.remove( 'aca-menu-open' );
				menuBtn.setAttribute( 'aria-expanded', 'false' );
			}
		} );

		// Start new chat
		document.getElementById( 'aca-menu-new' ).addEventListener( 'click', function () {
			menu.classList.remove( 'aca-menu-open' );
			startNewChat();
		} );

		// End chat
		document.getElementById( 'aca-menu-end' ).addEventListener( 'click', function () {
			menu.classList.remove( 'aca-menu-open' );
			endChat();
		} );

		var teaser = document.getElementById( 'aca-teaser' );
		teaser.addEventListener( 'click', function ( e ) {
			if ( e.target.closest( '.aca-teaser-dismiss' ) ) return;
			toggleOpen();
			dismissTeaser();
		} );
		teaser.addEventListener( 'keydown', function ( e ) {
			if ( 'Enter' === e.key || ' ' === e.key ) {
				e.preventDefault();
				toggleOpen();
				dismissTeaser();
			}
		} );
		document.getElementById( 'aca-teaser-dismiss' ).addEventListener( 'click', function ( e ) {
			e.stopPropagation();
			dismissTeaser();
		} );

		var form = document.getElementById( 'aca-form' );
		var input = document.getElementById( 'aca-input' );
		var send = document.getElementById( 'aca-send' );

		form.addEventListener( 'submit', function ( e ) {
			e.preventDefault();
			sendMessage();
		} );

		input.addEventListener( 'keydown', function ( e ) {
			if ( 'Enter' === e.key && ! e.shiftKey ) {
				e.preventDefault();
				sendMessage();
			}
		} );

		input.addEventListener( 'input', function () {
			input.style.height = 'auto';
			input.style.height = Math.min( input.scrollHeight, 120 ) + 'px';
			send.disabled = ! input.value.trim();
		} );
	}

	function showTeaserBubble() {
		if ( state.open || teaserDismissed() || state.teaserShown ) return;
		if ( ! cfg.showTeaser ) return;
		state.teaserShown = true;
		var teaser = document.getElementById( 'aca-teaser' );
		if ( teaser ) teaser.classList.add( 'aca-teaser-visible' );
	}

	function startNewChat() {
		// Clear all conversation state and start fresh.
		state.messages = [];
		state.sessionId = generateSessionId();
		state.welcomeShown = false;
		saveSession();

		var container = document.getElementById( 'aca-messages' );
		if ( container ) container.innerHTML = '';

		renderWelcome();
		state.welcomeShown = true;

		var input = document.getElementById( 'aca-input' );
		if ( input ) {
			input.value = '';
			input.style.height = 'auto';
			input.focus();
		}
	}

	function endChat() {
		// Clear and close the panel.
		state.messages = [];
		state.sessionId = generateSessionId();
		state.welcomeShown = false;

		try {
			sessionStorage.removeItem( STORAGE_KEY );
		} catch ( e ) {}

		var container = document.getElementById( 'aca-messages' );
		if ( container ) container.innerHTML = '';

		// Close the panel.
		var root = document.getElementById( 'aca-root' );
		root.classList.remove( 'aca-open' );
		state.open = false;
	}

	function toggleOpen() {
		state.open = ! state.open;
		var root = document.getElementById( 'aca-root' );
		root.classList.toggle( 'aca-open', state.open );

		if ( state.open ) {
			dismissTeaser();
			// Only render welcome once per page load, and only if no real conversation exists.
			if ( ! state.welcomeShown && 0 === state.messages.length ) {
				renderWelcome();
				state.welcomeShown = true;
			}
			setTimeout( function () {
				var input = document.getElementById( 'aca-input' );
				if ( input ) input.focus();
			}, 250 );
		}
	}

	function renderWelcome() {
		var container = document.getElementById( 'aca-messages' );
		if ( ! container ) return;

		var wrap = document.createElement( 'div' );
		wrap.className = 'aca-message aca-message-assistant aca-welcome';

		var bubble = document.createElement( 'div' );
		bubble.className = 'aca-message-bubble';
		bubble.textContent = cfg.greeting || 'Hi! How can we help today?';
		wrap.appendChild( bubble );

		container.appendChild( wrap );
	}

	function renderMessage( msg, ctaPayload ) {
		var container = document.getElementById( 'aca-messages' );
		if ( ! container ) return;

		var wrap = document.createElement( 'div' );
		wrap.className = 'aca-message aca-message-' + msg.role;

		var bubble = document.createElement( 'div' );
		bubble.className = 'aca-message-bubble';
		bubble.textContent = msg.content;
		wrap.appendChild( bubble );

		container.appendChild( wrap );

		if ( ctaPayload ) {
			var ctaWrap = document.createElement( 'div' );
			ctaWrap.className = 'aca-cta-row aca-cta-row-' + msg.role;
			ctaWrap.appendChild( buildCtaButton( ctaPayload ) );
			container.appendChild( ctaWrap );
		}

		container.scrollTop = container.scrollHeight;
	}

	function buildCtaButton( cta ) {
		var btn = document.createElement( 'button' );
		btn.type = 'button';
		btn.className = 'aca-cta-btn';

		var iconSvg = '';
		if ( 'call' === cta.type ) {
			iconSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>';
		} else if ( 'form' === cta.type ) {
			iconSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>';
		}
		btn.innerHTML = iconSvg + '<span>' + escapeHtml( cta.label ) + '</span>';

		if ( 'call' === cta.type ) {
			btn.addEventListener( 'click', function () {
				trackOutcome( 'called' );
				window.location.href = 'tel:' + cta.value.replace( /[^0-9+]/g, '' );
			} );
		} else if ( 'form' === cta.type ) {
			btn.addEventListener( 'click', function () {
				trackOutcome( 'opened_form' );
				openLeadForm();
			} );
		}
		return btn;
	}

	function trackOutcome( outcome ) {
		try {
			fetch( cfg.restUrl + 'conversation/outcome', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-WP-Nonce': cfg.nonce,
				},
				body: JSON.stringify( {
					sessionId: state.sessionId,
					outcome: outcome,
				} ),
				keepalive: true,
			} );
		} catch ( e ) {}
	}

	function appendTyping() {
		var container = document.getElementById( 'aca-messages' );
		var wrap = document.createElement( 'div' );
		wrap.className = 'aca-message aca-message-assistant aca-typing';
		wrap.id = 'aca-typing';
		wrap.innerHTML =
			'<div class="aca-message-bubble aca-typing-bubble">' +
				'<span class="aca-dot"></span><span class="aca-dot"></span><span class="aca-dot"></span>' +
			'</div>';
		container.appendChild( wrap );
		container.scrollTop = container.scrollHeight;
	}

	function removeTyping() {
		var t = document.getElementById( 'aca-typing' );
		if ( t ) t.remove();
	}

	function sendMessage() {
		if ( state.busy ) return;
		var input = document.getElementById( 'aca-input' );
		var send = document.getElementById( 'aca-send' );
		var text = input.value.trim();
		if ( ! text ) return;

		input.value = '';
		input.style.height = 'auto';
		send.disabled = true;

		state.messages.push( { role: 'user', content: text } );
		renderMessage( { role: 'user', content: text } );
		saveSession();

		state.busy = true;
		appendTyping();

		fetch( cfg.restUrl + 'chat', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-WP-Nonce': cfg.nonce,
			},
			body: JSON.stringify( {
				messages: state.messages,
				sessionId: state.sessionId,
				pageUrl: cfg.currentUrl,
			} ),
		} )
			.then( function ( res ) {
				return res.json().then( function ( data ) {
					return { ok: res.ok, data: data };
				} );
			} )
			.then( function ( result ) {
				removeTyping();
				state.busy = false;

				if ( ! result.ok ) {
					renderMessage( {
						role: 'assistant',
						content: result.data && result.data.error
							? result.data.error
							: 'Sorry, something went wrong. Please try again.',
					} );
					return;
				}

				var reply = result.data.reply || '';
				var cta = result.data.cta || null;
				state.messages.push( { role: 'assistant', content: reply } );
				saveSession();
				renderMessage( { role: 'assistant', content: reply }, cta );
			} )
			.catch( function () {
				removeTyping();
				state.busy = false;
				renderMessage( {
					role: 'assistant',
					content: 'Network error. Please check your connection and try again.',
				} );
			} );
	}

	function openLeadForm() {
		if ( state.formOpen ) return;
		state.formOpen = true;

		var modal = document.createElement( 'div' );
		modal.className = 'aca-modal-backdrop';
		modal.innerHTML =
			'<div class="aca-modal" role="dialog" aria-label="Contact form">' +
				'<button type="button" class="aca-modal-close" aria-label="Close">' +
					'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
				'</button>' +
				'<div class="aca-modal-header">' +
					avatarHtml( 48, 'aca-modal-avatar' ) +
					'<h3 class="aca-modal-title">' + escapeHtml( cfg.formCtaLabel || 'Get in touch' ) + '</h3>' +
					'<p class="aca-modal-sub">Leave your details and we will reach out shortly.</p>' +
				'</div>' +
				'<form class="aca-lead-form" id="aca-lead-form">' +
					'<label><span>Name</span><input type="text" name="name" required placeholder="Your name"></label>' +
					'<label><span>Business name</span><input type="text" name="business_name" placeholder="Your company"></label>' +
					'<label><span>Email</span><input type="email" name="email" placeholder="you@example.com"></label>' +
					'<label><span>Phone</span><input type="tel" name="phone" placeholder="(555) 123-4567"></label>' +
					'<label><span>How can we help?</span><textarea name="message" rows="3" placeholder="Tell us a bit about what you need..."></textarea></label>' +
					'<button type="submit" class="aca-lead-submit">Send message</button>' +
					'<div class="aca-lead-status" id="aca-lead-status"></div>' +
				'</form>' +
			'</div>';

		document.body.appendChild( modal );

		modal.addEventListener( 'click', function ( e ) {
			if ( e.target === modal ) {
				closeLeadForm( modal );
			}
		} );
		modal.querySelector( '.aca-modal-close' ).addEventListener( 'click', function () {
			closeLeadForm( modal );
		} );

		modal.querySelector( '#aca-lead-form' ).addEventListener( 'submit', function ( e ) {
			e.preventDefault();
			submitLeadForm( e.target, modal );
		} );

		setTimeout( function () {
			var nameInput = modal.querySelector( 'input[name="name"]' );
			if ( nameInput ) nameInput.focus();
		}, 100 );
	}

	function closeLeadForm( modal ) {
		state.formOpen = false;
		if ( modal && modal.parentNode ) {
			modal.parentNode.removeChild( modal );
		}
	}

	function submitLeadForm( form, modal ) {
		var status = modal.querySelector( '#aca-lead-status' );
		var submit = form.querySelector( '.aca-lead-submit' );
		status.textContent = '';
		submit.disabled = true;
		submit.textContent = 'Sending...';

		var data = {
			name: form.name.value.trim(),
			business_name: form.business_name.value.trim(),
			email: form.email.value.trim(),
			phone: form.phone.value.trim(),
			message: form.message.value.trim(),
			transcript: state.messages,
			pageUrl: cfg.currentUrl,
			sessionId: state.sessionId,
		};

		fetch( cfg.restUrl + 'lead', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-WP-Nonce': cfg.nonce,
			},
			body: JSON.stringify( data ),
		} )
			.then( function ( res ) {
				return res.json().then( function ( body ) {
					return { ok: res.ok, body: body };
				} );
			} )
			.then( function ( result ) {
				if ( ! result.ok ) {
					status.className = 'aca-lead-status aca-error';
					status.textContent = ( result.body && result.body.error ) || 'Something went wrong.';
					submit.disabled = false;
					submit.textContent = 'Send message';
					return;
				}
				status.className = 'aca-lead-status aca-success';
				status.textContent = 'Thanks! We will be in touch soon.';
				submit.style.display = 'none';
				setTimeout( function () {
					closeLeadForm( modal );
					var followup = 'Got it. Someone from our team will reach out shortly. Anything else I can help with in the meantime?';
					renderMessage( { role: 'assistant', content: followup } );
					state.messages.push( { role: 'assistant', content: followup } );
					saveSession();
				}, 1500 );
			} )
			.catch( function () {
				status.className = 'aca-lead-status aca-error';
				status.textContent = 'Network error. Please try again.';
				submit.disabled = false;
				submit.textContent = 'Send message';
			} );
	}

	function init() {
		// Debug aid - shows in browser console what icons are configured.
		// Confirms whether the new launcherIconUrl field is reaching the frontend.
		try {
			console.log( '[Kosick AI Chat] cfg.launcherIconUrl =', cfg.launcherIconUrl || '(empty)' );
			console.log( '[Kosick AI Chat] cfg.avatarUrl =', cfg.avatarUrl || '(empty)' );
		} catch ( e ) {}

		loadSession();
		buildRoot();

		// Replay prior session messages.
		if ( state.messages.length > 0 ) {
			state.messages.forEach( function ( m ) {
				renderMessage( m );
			} );
			// If we have real messages, no welcome needed.
			state.welcomeShown = true;
		}

		// Schedule the proactive teaser bubble.
		if ( cfg.showTeaser && ! teaserDismissed() ) {
			var delayMs = ( cfg.teaserDelay || 4 ) * 1000;
			setTimeout( showTeaserBubble, delayMs );
		}
	}

	if ( 'loading' === document.readyState ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else {
		init();
	}
} )();
