import { HttpClient } from '@angular/common/http';
import {
  MoleculerFind,
  MoleculerFindOptions,
  MoleculerGetOptions,
  MoleculerList,
  MoleculerListOptions,
} from '../../shared/models/MoleculerWrapper';
import { createHttpParams, RawHttpParams } from '../../shared/utils';
import { Subject } from 'rxjs';

export class BaseCrudService<T extends { _id?: string }, AdditionalFilterFields extends RawHttpParams = {}> {
  protected refreshSubject = new Subject<void>();
  public refresh$ = this.refreshSubject.asObservable();

  constructor(
    protected http: HttpClient,
    protected baseUrl: string,
  ) { }

  list(options: AdditionalFilterFields & MoleculerListOptions): Promise<MoleculerList<T>> {
    return this.http.get<MoleculerList<T>>(
      this.baseUrl,
      { params: createHttpParams({ ...options }) },
    ).toPromise();
  }

  find(options: AdditionalFilterFields & MoleculerFindOptions): Promise<MoleculerFind<T>> {
    return this.http.get<MoleculerFind<T>>(
      `${this.baseUrl}/find`,
      { params: createHttpParams({ ...options }) },
    ).toPromise();
  }

  get(id: string, options: MoleculerGetOptions = {}): Promise<T> {
    return this.http.get<T>(
      `${this.baseUrl}/${id}`,
      { params: createHttpParams({ ...options }) },
    ).toPromise();
  }

  async create(model: T): Promise<T> {
    const t = await this.http.post<T>(this.baseUrl, model).toPromise();
    this.refreshSubject.next();
    return t;
  }

  async insert(models: T[]): Promise<T[]> {
    const t = await this.http.post<T[]>(`${this.baseUrl}/insert`, { entities: models }).toPromise();
    this.refreshSubject.next();
    return t;
  }

  async update(model: T): Promise<T> {
    const t = await this.http.put<T>(`${this.baseUrl}/${model._id}`, model).toPromise();
    this.refreshSubject.next();
    return t;
  }

  async remove(id: string): Promise<T> {
    const t = await this.http.delete<T>(`${this.baseUrl}/${id}`).toPromise();
    this.refreshSubject.next();
    return t;
  }
}
