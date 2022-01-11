import { getRepository, Repository } from "typeorm";

import { User } from "../../../users/entities/User";
import { Game } from "../../entities/Game";

import { IGamesRepository } from "../IGamesRepository";

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    const game = await this.repository
      .createQueryBuilder("games")
      .where("LOWER(games.title) Ilike LOWER(:title)", { title: `%${param}%` })
      .getMany();

    return game;
    // Complete usando query builder
  }

  async countAllGames(): Promise<[{ count: string }]> {
    const gameCount = await this.repository.query("SELECT COUNT(*) FROM games");

    return gameCount; // Complete usando raw query
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const all = await this.repository
      .createQueryBuilder("games")
      .leftJoinAndSelect("games.users", "user")
      .where("games.id = :id", { id: id })
      .getOneOrFail();

    return all.users;
    // Complete usando query builder
  }
}
