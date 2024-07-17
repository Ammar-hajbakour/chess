import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LocalBoardComponent } from './components/local-board/local-board.component';
import { HomeComponent } from './pages/home/home.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'chess';
}
