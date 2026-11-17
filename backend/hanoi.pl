% ==========================================
% TOWER OF HANOI - PROLOG BACKEND
% ==========================================

% ------------------------------------------
% Minimum number of moves
% Formula: 2^N - 1
% ------------------------------------------

minimum_moves(N, Moves) :-
    Moves is 2^N - 1.


% ------------------------------------------
% Check if a move is valid
%
% A move is valid when:
% 1. The source tower is not empty.
% 2. The destination is empty OR
%    the moving disk is smaller than
%    the top disk on the destination.
% ------------------------------------------

valid_move(Source, Destination) :-
    Source = [TopDisk|_],
    (
        Destination = []
        ;
        Destination = [DestinationTop|_],
        TopDisk < DestinationTop
    ).


% ------------------------------------------
% Move one disk
% ------------------------------------------

move_disk(Source, Destination, NewSource, NewDestination) :-
    Source = [Disk|Rest],
    (
        Destination = [],
        NewDestination = [Disk]
        ;
        Destination = [Top|RestDestination],
        Disk < Top,
        NewDestination = [Disk, Top|RestDestination]
    ),
    NewSource = Rest.


% ------------------------------------------
% Solve Tower of Hanoi
% ------------------------------------------

hanoi(1, From, To, _, [[From, To]]) :- !.

hanoi(N, From, To, Auxiliary, Moves) :-
    N > 1,
    N1 is N - 1,

    hanoi(N1, From, Auxiliary, To, Moves1),

    hanoi(N1, Auxiliary, To, From, Moves2),

    append(
        Moves1,
        [[From, To]|Moves2],
        Moves
    ).


% ------------------------------------------
% Get solution for a specific number of disks
% ------------------------------------------

solve(N, Moves) :-
    integer(N),
    N > 0,
    hanoi(N, left, right, middle, Moves).


% ------------------------------------------
% Display solution
% ------------------------------------------

show_solution(N) :-
    solve(N, Moves),
    length(Moves, Count),

    format('~nTower of Hanoi Solution~n', []),
    format('Disks: ~w~n', [N]),
    format('Minimum Moves: ~w~n~n', [Count]),

    show_moves(Moves, 1).


show_moves([], _).

show_moves([[From, To]|Rest], Number) :-
    format('~w. Move from ~w to ~w~n',
           [Number, From, To]),

    NextNumber is Number + 1,

    show_moves(Rest, NextNumber).