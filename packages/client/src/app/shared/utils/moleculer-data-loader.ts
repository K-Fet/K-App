import { MoleculerDataSource } from './moleculer-data-source';
import { MatPaginator } from '@angular/material/paginator';
import { ElementRef } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RawHttpParams } from './index';
import { MoleculerListOptions } from '../models/MoleculerWrapper';
import { fromEvent, merge, NEVER, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, first, tap } from 'rxjs/operators';


interface MoleculerAdditionalLoader<Options> {
  /**
   * Callback called after loading base moleculer params from query.
   */
  loadFromQuery?: (params: Params) => void | Promise<void>;
  /**
   * Function called before loading data from DataSource. Receive base options that will be sent
   * and must return a full option object.
   */
  addQueryOptions?: (options: Partial<Options>) => Options;
  /**
   * Refresh Observable used to reload data on change.
   */
  refresh?: Observable<void>;
  /**
   * Optional search input element.
   */
  searchInput?: ElementRef;
}

export class MoleculerDataLoader<Model, AdditionalFilterFields extends RawHttpParams = {}> {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataSource: MoleculerDataSource<Model, AdditionalFilterFields>,
    private paginator: MatPaginator,
    private sort: MatSort,
    private options: MoleculerAdditionalLoader<AdditionalFilterFields & MoleculerListOptions> = {},
  ) {}

  /**
   * Hydrate everything from current route
   */
  async init(): Promise<void> {
    await this.loadQueryParams();

    await this.loadPage({ skipRouteQueryParams: true });

    this.mergeInput();
  }

  async reload(): Promise<void> {
    await this.loadPage();
  }

  /**
   * Initialize each component with route query params.
   * Additional query params can be loaded through `loadFromQuery` function.
   *
   * Note that default sort is -updatedAt (not configurable for now).
   */
  private async loadQueryParams(): Promise<void> {
    // Load state from query params
    const value = await this.route.queryParams.pipe(first()).toPromise();

    this.paginator.pageSize = +value['pageSize'];
    this.paginator.pageIndex = +value['page'] - 1;

    const [, direction, sort] = /^(-)?(\w+)$/.exec(value['sort'] || '') || [undefined, '-', 'updatedAt'];
    this.sort.direction = direction ? 'desc' : 'asc';
    this.sort.active = sort;

    if (this.options.searchInput) {
      this.options.searchInput.nativeElement.value = value['search'] || '';
    }

    if (this.options.loadFromQuery) {
      await this.options.loadFromQuery(value);
    }
  }

  /**
   * Listen to every needed observable and load page on change.
   */
  private mergeInput(): void {
    // Server-side search
    const search = this.options.searchInput ? fromEvent(this.options.searchInput.nativeElement, 'keyup').pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.paginator.pageIndex = 0),
    ) : NEVER;

    // Reset the paginator after sorting
    const sort = this.sort.sortChange.pipe(tap(() => this.paginator.pageIndex = 0));

    // Merge everything to reload members
    merge(search, sort, this.paginator.page, this.options.refresh || NEVER).subscribe(() => this.loadPage());
  }

  /**
   * Load page from provided DataSource.
   * Missing options will be loaded from `addQueryOptions` function.
   *
   * @param skipRouteQueryParams If set, it will not update route with provided options
   */
  async loadPage({ skipRouteQueryParams }: { skipRouteQueryParams?: boolean } = {}): Promise<void> {
    let options = {
      pageSize: this.paginator.pageSize,
      page: this.paginator.pageIndex + 1,
      search: this.options.searchInput ? this.options.searchInput.nativeElement.value : undefined,
      sort: this.sort.active && `${this.sort.direction === 'desc' ? '-' : ''}${this.sort.active}`,
    } as AdditionalFilterFields & MoleculerListOptions;

    if (this.options.addQueryOptions) {
      options = this.options.addQueryOptions(options as AdditionalFilterFields & MoleculerListOptions);
    }

    await this.dataSource.load(options);

    if (!skipRouteQueryParams) {
      await this.router.navigate([], {
        relativeTo: this.route,
        queryParams: options,
        queryParamsHandling: 'merge',
      });
    }
  }
}
