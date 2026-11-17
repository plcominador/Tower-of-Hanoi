:- use_module(library(http/thread_httpd)).
:- use_module(library(http/http_dispatch)).
:- use_module(library(http/http_json)).
:- use_module(library(http/http_cors)).

:- consult(hanoi).

:- set_setting(http:cors, [*]).

:- http_handler(root(minimum_moves), minimum_moves_handler, []).
:- http_handler(root(solve), solve_handler, []).

start_server(Port) :-
    http_server(http_dispatch, [port(Port)]),
    format('~n=================================~n', []),
    format(' Tower of Hanoi Prolog Server~n', []),
    format(' Server running on port ~w~n', [Port]),
    format('=================================~n~n', []).


minimum_moves_handler(Request) :-
    http_read_json_dict(Request, Data),
    N = Data.get(n),

    minimum_moves(N, Moves),

    reply_json_dict(_{
        disks: N,
        minimum_moves: Moves
    }).


solve_handler(Request) :-
    http_read_json_dict(Request, Data),
    N = Data.get(n),

    solve(N, Moves),

    reply_json_dict(_{
        disks: N,
        moves: Moves
    }).