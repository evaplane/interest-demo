import {Observable, Subscriber} from 'rxjs'

export default class Emiter {
  observers : Map<string, Array<Subscriber<any>>>

  constructor(){
    this.observers = new Map() 
  }

  on(topic : string) : Observable<any> {
    return new Observable<any>(observer => {
      if(!this.observers.has(topic)) {
        this.observers.set(topic, [])
      } 

      const list = this.observers.get(topic) || []
      list.push(observer)
      return {
        unsubscribe: () => {
          this.observers.set(
            topic,
            list.filter((o) => o !== observer)
          )
        },
      }
    })
  }

  emit(topic :string, data? : any) :void {
    if(this.observers.has(topic)) {

      (this.observers.get(topic) || []).forEach(observer => {
        observer.next(data)
      })
    }
  }
}