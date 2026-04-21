import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RetrospectiveComponent } from './retrospective.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('RetrospectiveComponent', () => {
    let component: RetrospectiveComponent;
    let fixture: ComponentFixture<RetrospectiveComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RetrospectiveComponent, NoopAnimationsModule],
        }).compileComponents();

        fixture = TestBed.createComponent(RetrospectiveComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create component', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize form rows', () => {
        expect(component.rows.length).toBe(3);
    });

    it('should reset form on cancel', () => {
        component.rows.at(0).patchValue({ activity: 'Test' });
        component.onCancel();
        expect(component.rows.at(0).value.activity).toBeNull();
    });
});
