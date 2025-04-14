# Cogni-Blocks

This project is an interview assignment that uses an LLM (Gemini) and player voice input to control a simple grid-based game.

https://sprixle.studio/cogni-blocks/

See assignment [here](assignment.md).

# Setup
To run entirely local a Google Cloud API key with access to the gemini api will be required.

install dependencies `npm i`

start the server `GEMINI_API_KEY={KEY} npm run api`
start vite dev server `npm run dev`

I'd recommend just using the production build (linked above), you could also contact me for a key if you want to run locally.

# Core Game Logic

I often use projects like this, where there's no production environment at the end, as an opportunity to develop something more broadly useful. In this case, I created a Vue plugin for my game engine.

The game logic is located in `src/game` and utilizes my game engine's ECS (Entity Component System) and Query APIs. The Vue plugin then bridges to the game using standard Vue APIs, enabling Vue to render the game based on its data-driven state.

This approach enforces a separation between data-driven logic and rendering. If this project were to require multiplayer support, running only the ECS on the server-side would be straightforward. Adding new game logic, such as blocks that fall from above with each step, becomes very easy and is purely a matter of data and systems, as all rendering is generic and data-driven.

Positioning within the game's data uses simple grid cell values. The size of each grid block is determined by the rendering, which simplifies collision and movement calculations.

Moves are made utilizing a queue of `isMoveSignal` entities. Every voice response creates a new one. the movement system pulls the oldest off the stack every 50 ms.

# Rendering

HTML and CSS are used for all rendering. I use a background gradient technique to render the background grid. This gradient is composited by modern browsers and, because it's static, renders very efficiently.

Each shape is rendered as a grid using HTML rows and blocks. I used CSS variables to make the HTML and CSS expressive when viewed in isolation.

This also allows for quick 'n dirty smooth shape movement using simple CSS transitions.

# Flexibility

I designed many of the components and logic systems to be general-purpose. My past game projects have taught me the importance of this.

For example, the `isControlled` component can be attached to *any* entity with a `position`, and the `movementSystem` will move that entity based on inputs. This means the ball doesn't have to be the only entity the player controls, or the only entity controlled at any given time. Adding multiple balls of different colors or sizes, with player selection/deselection via voice input, would require only new systems and shapes, not significant refactoring.

# Live VAD-Based Input

I chose Gemini because I was already somewhat familiar with its API. I felt that a good user experience required pause detection and Voice Activity Detection (VAD), so I used Gemini's Live API. Audio chunks are streamed in real-time using a worklet, with WebSockets used throughout the pipeline.

The LLM prompting is the only aspect I'm not fully satisfied with; the LLM's performance sometimes varies. I would likely investigate this further, it might have more to do with the live voice detection piece of it.

I believe there's significant potential to dynamically prompt the LLM based on proximity to other shapes. For example, if the LLM knows where the wall is, the player could say, "move up until the wall doesn't collide with the wall". As game complexity increases, manipulating the LLM and player's understanding of the game world could lead to unique mechanics.


# Coding Approach

I utilized LLM coding where it made sense to (collision code, configuration steps for cloud stuff, boilerplate, larger but simple refactors). Though for the meat of things I move much faster without. Google was opened maybe twice for extra weird build issues that LLMs were no help on.

My goal is readable and clear code that's easy to test by actually using it.

If I felt documentation was necessary I do it directly in the code.

# Issues / Concerns

* When the AI session ends/times out you have to refresh.
* Ideally there'd be better UI feedback for the voice input. I imagined several niceties here but decided not to push beyond 5 hours of work.